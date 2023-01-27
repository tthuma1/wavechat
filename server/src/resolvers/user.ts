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
import { validateRegister } from "../utils/validateRegister";
// import { getConnection } from "typeorm";
import { AppDataSource } from "../DataSource";
import { FieldError } from "./FieldError";

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Query(() => [User])
  async user(@Arg("id") id: number) {
    const user = await User.findBy({ id });
    return user;
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

    if (options.email === "") options.email = undefined;

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

  @Query(() => [Friendship])
  async getFriends(@Arg("userId") userId: number) {
    // const user = await User.find({
    //   where: {
    //     id: userId,
    //   },
    //   relations: { friends1: true, friends2: true },
    // });

    // select f.user2Id from user inner join friendship f on user.id = f.user1Id where user.id = 1
    // union
    // select f.user1Id from user inner join friendship f on user.id = f.user2Id where user.id = 1;

    // const user = await User.createQueryBuilder("user")
    //   .leftJoinAndSelect("user.friends1", "friendship")
    //   .getMany();

    let friends = await Friendship.find({
      where: [
        {
          user1Id: userId,
        },
        {
          user2Id: userId,
        },
      ],
    });

    return friends;
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

    if (
      await Friendship.findBy({
        user1Id: req.session.userId,
        user2Id: friendId,
      })
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
    friendship.user1Id = req.session.userId;
    friendship.user2Id = friendId;

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
}
