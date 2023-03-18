import { User } from "../enitities/User";
import { Friendship } from "../enitities/Friendship";
import argon2 from "argon2";
import { MyContext } from "../types";
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from "type-graphql";
import { UsernamePasswordInput } from "./UsernamePasswordInput";
import { validateRegister, validateEmail } from "../utils/validateRegister";
// import { getConnection } from "typeorm";
import { AppDataSource } from "../DataSource";
import { FieldError } from "./FieldError";
// import { Group } from "../enitities/Group";
// import { Group_Has_User } from "../enitities/Group_Has_User";
import { v4 } from "uuid";
import { sendEmail } from "../utils/sendEmail";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class UsersResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [User], { nullable: true })
  users?: User[];
}

@ObjectType()
class FriendshipResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Friendship, { nullable: true })
  friendship?: Friendship;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this is the current user and its ok to show them their own email
    if (req.session.userId === user.id) {
      return user.email;
    }
    // current user wants to see someone elses email
    return "";
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    // you are not logged in
    if (!req.session.userId) {
      return null;
    }

    return User.findOneBy({ id: req.session.userId });
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { req }: MyContext
  ) {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password);
    let user;

    try {
      // User.create({}).save()
      const result = await AppDataSource.createQueryBuilder()
        .insert()
        .into(User)
        .values({
          username: options.username,
          email: options.email,
          password: hashedPassword,
        })
        .returning("*")
        .execute();
      user = result.raw[0];
    } catch (err) {
      console.log(err);
      //|| err.detail.includes("already exists")) {
      // duplicate username error
      if (err.sqlMessage.includes("Duplicate entry")) {
        return {
          errors: [
            {
              field: "username",
              message: "Username already taken.",
            },
          ],
        };
      }
    }

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string,
    @Ctx() { req }: MyContext
  ) {
    const user = await User.findOne(
      usernameOrEmail.includes("@")
        ? { where: { email: usernameOrEmail } }
        : { where: { username: usernameOrEmail } }
    );

    // no username in database
    if (!user) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "This user doesn't exist.",
          },
        ],
      };
    }
    const valid = await argon2.verify(user.password, password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "Incorrect password.",
          },
        ],
      };
    }

    req.session.userId = user.id;

    return {
      user,
    };
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise(resolve =>
      req.session.destroy(err => {
        res.clearCookie("qid");
        if (err) {
          console.log(err);
          resolve(false);
          return;
        }

        resolve(true);
      })
    );
  }

  @Query(() => [User])
  async getFriends(@Arg("userId") userId: number) {
    // const user = await User.find({
    //   where: {
    //     id: userId,
    //   },
    //   relations: { friends1: true, friends2: true },
    // });

    // console.log(user);

    // select f.user2Id from user inner join friendship f on user.id = f.user1Id where user.id = 1
    // union
    // select f.user1Id from user inner join friendship f on user.id = f.user2Id where user.id = 1;

    // const user = await User.createQueryBuilder("user")
    //   .leftJoinAndSelect("user.friends1", "friendship")
    //   .getMany();

    let friendIds = await Friendship.find({
      where: [
        {
          user1Id: userId,
        },
        {
          user2Id: userId,
        },
      ],
    });

    let friends: User[] = [];

    for (const friendship of friendIds) {
      if (friendship.user1Id == userId) {
        const friend = await User.findOneBy({ id: friendship.user2Id });
        if (friend != null) friends.push(friend);
      } else {
        const friend = await User.findOneBy({ id: friendship.user1Id });
        if (friend != null) friends.push(friend);
      }
    }

    return friends;
  }

  @Query(() => UsersResponse)
  async getFriendsCurrent(@Ctx() { req }: MyContext) {
    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    return { users: this.getFriends(req.session.userId) };
  }

  @Mutation(() => FriendshipResponse) // Boolean) //UserResponse)
  async addFriend(
    @Ctx() { req }: MyContext,
    @Arg("friendId") friendId: number
  ) {
    if ((await User.findBy({ id: friendId })).length === 0) {
      return {
        errors: [
          {
            field: "friendId",
            message: "Friend ID doesn't exist.",
          },
        ],
      };
    }

    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    if (req.session.userId == friendId) {
      return {
        errors: [
          {
            field: "friendId",
            message: "Cannot add yourself as a friend.",
          },
        ],
      };
    }

    let user1Id = req.session.userId;
    let user2Id = friendId;

    if (user1Id > user2Id) [user1Id, user2Id] = [user2Id, user1Id];

    if (
      (
        await Friendship.findBy({
          user1Id,
          user2Id,
        })
      ).length > 0
    ) {
      return {
        errors: [
          {
            field: "friendId",
            message: "Friend already added.",
          },
        ],
      };
    }

    // let user = (
    //   await User.find({
    //     where: {
    //       id: req.session.userId,
    //     },
    //     relations: { friends: true },
    //   })
    // )[0];

    // let friend = (await User.find({ where: { id: friendId } }))[0];

    let friendship = new Friendship();
    friendship.user1Id = user1Id;
    friendship.user2Id = user2Id;

    await friendship.save();

    // let user = new User();
    // user.id = req.session.userId;

    // let friend = new User();
    // friend.id = friendId;

    // user.friends = [friend];

    // user.friends.push(friend);

    // await user.save();

    return { friendship: friendship };
    // return true;
  }

  @Query(() => UserResponse)
  async getUser(@Arg("id") id: number) {
    const user = await User.findOneBy({ id });

    if (user) {
      return { user };
    } else {
      return {
        errors: [
          {
            field: "id",
            message: "User id doesn't exist.",
          },
        ],
      };
    }
  }

  @Mutation(() => FriendshipResponse) // Boolean) //UserResponse)
  async removeFriend(
    @Ctx() { req }: MyContext,
    @Arg("friendId") friendId: number
  ) {
    if ((await User.findBy({ id: friendId })).length === 0) {
      return {
        errors: [
          {
            field: "friendId",
            message: "Friend ID doesn't exist.",
          },
        ],
      };
    }

    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    let user1Id = req.session.userId;
    let user2Id = friendId;

    if (user1Id > user2Id) [user1Id, user2Id] = [user2Id, user1Id];

    const friendship = await Friendship.findOneBy({
      user1Id,
      user2Id,
    });

    if (!friendship) {
      return {
        errors: [
          {
            field: "friendId",
            message: "Friend not added",
          },
        ],
      };
    }

    await AppDataSource.query(
      `
DELETE FROM friendship
WHERE user1Id = ? AND user2Id = ?;
`,
      [user1Id, user2Id]
    );

    return { friendship };
  }

  @Mutation(() => UserResponse)
  async changeEmail(
    @Arg("newEmail") newEmail: string,
    @Ctx() { req }: MyContext
  ) {
    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    const errors = validateEmail(newEmail);
    if (errors) {
      return { errors };
    }

    AppDataSource.createQueryBuilder()
      .update(User)
      .set({
        email: newEmail,
      })
      .where("id = :id", { id: req.session.userId })
      .execute();

    const user = await User.findOneBy({ id: req.session.userId });

    return { user };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg("oldPassword") oldPassword: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { req }: MyContext
  ) {
    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    let user = await User.findOneBy({ id: req.session.userId });

    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "Cannot find user.",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, oldPassword);
    if (!valid) {
      return {
        errors: [
          {
            field: "oldPassword",
            message: "Incorrect password.",
          },
        ],
      };
    }

    await User.update(
      { id: req.session.userId },
      {
        password: await argon2.hash(newPassword),
      }
    );

    user = await User.findOneBy({ id: req.session.userId });
    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "Cannot find user.",
          },
        ],
      };
    }

    // await new Promise(resolve =>
    //   req.session.destroy(err => {
    //     res.clearCookie("qid");
    //     if (err) {
    //       console.log(err);
    //       resolve(false);
    //       return;
    //     }

    //     resolve(true);
    //   })
    // );

    // req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async changePasswordToken(
    @Arg("token") token: string,
    @Arg("newPassword") newPassword: string,
    @Ctx() { redis, req }: MyContext
  ) {
    if (newPassword.length <= 2) {
      return {
        errors: [
          {
            field: "newPassword",
            message: "length must be greater than 2",
          },
        ],
      };
    }

    const key = "forgotPassword:" + token;
    const userId = await redis.get(key);
    if (!userId) {
      return {
        errors: [
          {
            field: "token",
            message: "token expired",
          },
        ],
      };
    }

    const userIdNum = parseInt(userId);
    const user = await User.findOneBy({ id: userIdNum });

    if (!user) {
      return {
        errors: [
          {
            field: "token",
            message: "user no longer exists",
          },
        ],
      };
    }

    await User.update(
      { id: userIdNum },
      {
        password: await argon2.hash(newPassword),
      }
    );

    await redis.del(key);

    // log in user after change password
    req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async changeAvatar(
    @Arg("filename") filename: string,
    @Ctx() { req }: MyContext
  ) {
    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    let user = await User.findOneBy({ id: req.session.userId });

    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "Cannot find user.",
          },
        ],
      };
    }

    await User.update(
      { id: req.session.userId },
      {
        avatar: filename,
      }
    );

    user = await User.findOneBy({ id: req.session.userId });
    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "Cannot find user.",
          },
        ],
      };
    }

    return { user };
  }

  @Query(() => UsersResponse)
  async searchUsers(
    @Arg("username") username: string,
    @Ctx() { req }: MyContext
  ) {
    if (username == "") return { users: [] };

    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not logged in.",
          },
        ],
      };
    }

    const users = await AppDataSource.query(
      `
SELECT * FROM user
WHERE id != ? AND (LOWER(username) LIKE LOWER(CONCAT('%', ?, '%'))
OR levenshtein(username, ?) <= 2)
ORDER BY levenshtein(username, ?)
LIMIT 15;
`,
      [req.session.userId, username, username, username]
    );

    return { users };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      // the email is not in the db
      return true;
    }

    const token = v4();

    await redis.set(
      "forgotPassword:" + token,
      user.id,
      "EX",
      1000 * 60 * 60 * 24 * 3
    ); // 3 days

    await sendEmail(
      email,
      `<a href="http://localhost:3000/change-password/${token}">reset password</a>`
    );

    return true;
  }
}
