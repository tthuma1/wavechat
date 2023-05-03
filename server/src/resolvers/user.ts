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
export class UserResponse {
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
    @Ctx() { redis }: MyContext
  ) {
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    const hashedPassword = await argon2.hash(options.password, {
      type: argon2.argon2i,
    });
    // let user;

    // if unverified user with same email exists, delete them from table
    let sameEmail = await User.findOneBy({ email: options.email });
    if (sameEmail && !sameEmail.isVerified) {
      await User.delete({ email: options.email });
    }

    if (await User.findOneBy({ username: options.username })) {
      return {
        errors: [
          {
            field: "username",
            message: "Username already taken.",
          },
        ],
      };
    }

    const user = new User();
    user.username = options.username;
    user.email = options.email;
    user.password = hashedPassword;

    await user.save();

    /*
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
    */

    // send confirmation email
    const token = v4();

    await redis.set("verifyEmail:" + token, user.id, "EX", 60 * 60 * 24 * 3); // 3 days, v sekundah

    await sendEmail(
      options.email,
      "Verify email",
      `
      <!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Email Confirmation</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }
  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #1a82e2;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Verify your WaveChat account.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="${process.env.DOMAIN}" target="_blank" style="display: inline-block;">
                <img src="https://wavechat.si/favicon.ico" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Confirm Your Email Address</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to confirm your email address. If you didn't create an account with <a href="https://wavechat.si">WaveChat</a>, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="${process.env.DOMAIN}/verify/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">Verify Email</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
              <p style="margin: 0;"><a href="${process.env.DOMAIN}/verify/${token}" target="_blank">${process.env.DOMAIN}/verify/${token}</a></p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">


        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>`
      // `<a href="${process.env.DOMAIN}/verify/${token}">verify email</a>`
    );

    // store user id session
    // this will set a cookie on the user
    // keep them logged in
    // req.session.userId = user.id;

    return { user };
  }

  @Mutation(() => UserResponse)
  async verifyEmail(
    @Arg("token") token: string,
    @Ctx() { redis, req }: MyContext
  ) {
    const key = "verifyEmail:" + token;
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
        isVerified: true,
      }
    );

    await redis.del(key);

    // log in user after confirmation
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
    const valid = await argon2.verify(user.password, password, {
      type: argon2.argon2i,
    });
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

    if (!user.isVerified) {
      return {
        errors: [
          {
            field: "usernameOrEmail",
            message: "User's email is not verified",
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
  async changeUsername(
    @Arg("newUsername") newUsername: string,
    @Ctx() { req }: MyContext
  ) {
    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "userid",
            message: "user is not logged in.",
          },
        ],
      };
    }

    if (newUsername.length <= 2) {
      return {
        errors: [
          {
            field: "newUsername",
            message: "Length must be greater than 2.",
          },
        ],
      };
    }

    if (await User.findOneBy({ username: newUsername })) {
      return {
        errors: [
          {
            field: "newUsername",
            message: "Username is already taken.",
          },
        ],
      };
    }

    AppDataSource.createQueryBuilder()
      .update(User)
      .set({
        username: newUsername,
      })
      .where("id = :id", { id: req.session.userId })
      .execute();

    const user = await User.findOneBy({ id: req.session.userId });

    return { user };
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

    const valid = await argon2.verify(user.password, oldPassword, {
      type: argon2.argon2i,
    });
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
        password: await argon2.hash(newPassword, { type: argon2.argon2i }),
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
        password: await argon2.hash(newPassword, { type: argon2.argon2i }),
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

    await redis.set("forgotPassword:" + token, user.id, "EX", 60 * 60 * 24 * 3); // 3 days, v sekundah

    await sendEmail(
      email,
      "Reset password",
      `
      <!DOCTYPE html>
<html>
<head>

  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Password Reset</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style type="text/css">
  /**
   * Google webfonts. Recommended to include the .woff version for cross-client compatibility.
   */
  @media screen {
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 400;
      src: local('Source Sans Pro Regular'), local('SourceSansPro-Regular'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/ODelI1aHBYDBqgeIAH2zlBM0YzuT7MdOe03otPbuUS0.woff) format('woff');
    }
    @font-face {
      font-family: 'Source Sans Pro';
      font-style: normal;
      font-weight: 700;
      src: local('Source Sans Pro Bold'), local('SourceSansPro-Bold'), url(https://fonts.gstatic.com/s/sourcesanspro/v10/toadOcfmlt9b38dHJxOBGFkQc6VGVFSmCnC_l7QZG60.woff) format('woff');
    }
  }
  /**
   * Avoid browser level font resizing.
   * 1. Windows Mobile
   * 2. iOS / OSX
   */
  body,
  table,
  td,
  a {
    -ms-text-size-adjust: 100%; /* 1 */
    -webkit-text-size-adjust: 100%; /* 2 */
  }
  /**
   * Remove extra space added to tables and cells in Outlook.
   */
  table,
  td {
    mso-table-rspace: 0pt;
    mso-table-lspace: 0pt;
  }
  /**
   * Better fluid images in Internet Explorer.
   */
  img {
    -ms-interpolation-mode: bicubic;
  }
  /**
   * Remove blue links for iOS devices.
   */
  a[x-apple-data-detectors] {
    font-family: inherit !important;
    font-size: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
    color: inherit !important;
    text-decoration: none !important;
  }
  /**
   * Fix centering issues in Android 4.4.
   */
  div[style*="margin: 16px 0;"] {
    margin: 0 !important;
  }
  body {
    width: 100% !important;
    height: 100% !important;
    padding: 0 !important;
    margin: 0 !important;
  }
  /**
   * Collapse table borders to avoid space between cells.
   */
  table {
    border-collapse: collapse !important;
  }
  a {
    color: #1a82e2;
  }
  img {
    height: auto;
    line-height: 100%;
    text-decoration: none;
    border: 0;
    outline: none;
  }
  </style>

</head>
<body style="background-color: #e9ecef;">

  <!-- start preheader -->
  <div class="preheader" style="display: none; max-width: 0; max-height: 0; overflow: hidden; font-size: 1px; line-height: 1px; color: #fff; opacity: 0;">
    Reset your WaveChat password.
  </div>
  <!-- end preheader -->

  <!-- start body -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%">

    <!-- start logo -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="center" valign="top" style="padding: 36px 24px;">
              <a href="${process.env.DOMAIN}" target="_blank" style="display: inline-block;">
                <img src="https://wavechat.si/favicon.ico" alt="Logo" border="0" width="48" style="display: block; width: 48px; max-width: 48px; min-width: 48px;">
              </a>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end logo -->

    <!-- start hero -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 36px 24px 0; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; border-top: 3px solid #d4dadf;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px;">Reset Your Password</h1>
            </td>
          </tr>
        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end hero -->

    <!-- start copy block -->
    <tr>
      <td align="center" bgcolor="#e9ecef">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">Tap the button below to reset your password. If you didn't opt to reset your password, you can safely delete this email.</p>
            </td>
          </tr>
          <!-- end copy -->

          <!-- start button -->
          <tr>
            <td align="left" bgcolor="#ffffff">
              <table border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td align="center" bgcolor="#ffffff" style="padding: 12px;">
                    <table border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" bgcolor="#1a82e2" style="border-radius: 6px;">
                          <a href="${process.env.DOMAIN}/change-password/${token}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; color: #ffffff; text-decoration: none; border-radius: 6px;">Change Password</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- end button -->

          <!-- start copy -->
          <tr>
            <td align="left" bgcolor="#ffffff" style="padding: 24px; font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 24px;">
              <p style="margin: 0;">If that doesn't work, copy and paste the following link in your browser:</p>
              <p style="margin: 0;"><a href="${process.env.DOMAIN}/change-password/${token}" target="_blank">${process.env.DOMAIN}/change-password/${token}</a></p>
            </td>
          </tr>
          <!-- end copy -->

        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end copy block -->

    <!-- start footer -->
    <tr>
      <td align="center" bgcolor="#e9ecef" style="padding: 24px;">
        <!--[if (gte mso 9)|(IE)]>
        <table align="center" border="0" cellpadding="0" cellspacing="0" width="600">
        <tr>
        <td align="center" valign="top" width="600">
        <![endif]-->
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px;">


        </table>
        <!--[if (gte mso 9)|(IE)]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
    <!-- end footer -->

  </table>
  <!-- end body -->

</body>
</html>`
      // `<a href="${process.env.DOMAIN}/change-password/${token}">reset password</a>`
    );

    return true;
  }
}
