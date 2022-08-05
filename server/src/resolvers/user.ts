import { User } from "../enitities/User";
import argon2 from "argon2";
import { MyContext } from "../types";

export const UserResolver = {
  Query: {
    async user(_parent: any, args: { id: number }) {
      const user = await User.findBy({ id: args.id });
      return user;
    },

    me(_parent: any, _args: any, { req }: MyContext) {
      // you are not logged in
      if (!req.session.userId) {
        return null;
      }

      return User.findOneBy({ id: req.session.userId });
    },
  },

  Mutation: {
    async register(
      _parent: any,
      args: { username: string; email: string; password: string },
      { req }: MyContext
    ) {
      const user = new User();
      user.username = args.username;
      user.email = args.email;

      const hashedPassword = await argon2.hash(args.password);
      user.password = hashedPassword;

      req.session.userId = user.id;

      return await user.save();
    },

    async login(
      _parent: any,
      args: { usernameOrEmail: string; password: string },
      { req }: MyContext
    ) {
      const user = await User.findOne(
        args.usernameOrEmail.includes("@")
          ? { where: { email: args.usernameOrEmail } }
          : { where: { username: args.usernameOrEmail } }
      );

      // no username in database
      if (!user) {
        return {
          errors: [
            {
              field: "usernameOrEmail",
              message: "That username doesn't exist.",
            },
          ],
        };
      }
      const valid = await argon2.verify(user.password, args.password);
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
    },
  },
};
