import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";
import { FieldError } from "./FieldError";
import { Channel } from "../enitities/Channel";
import { AppDataSource } from "../DataSource";
import { MyContext } from "../types";
import { Whitelist } from "../enitities/Whitelist";
import { UsersResponse } from "./user";
import { User } from "../enitities/User";

@ObjectType()
class WhitelistResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Whitelist, { nullable: true })
  whitelist?: Whitelist;
}

@Resolver(Whitelist)
export class WhitelistResolver {
  @Mutation(() => WhitelistResponse)
  async addUserToWhitelist(
    @Arg("username") username: string,
    @Arg("channelId") channelId: number,
    @Ctx() { req }: MyContext
  ) {
    const channel = await Channel.findOneBy({ id: channelId });
    if (!channel) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel doesn't exist",
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

    let adminId = await AppDataSource.query(
      `
SELECT g.adminId FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
WHERE c.id = ? AND g.type = 'group';
    `,
      [channelId]
    );

    if (adminId.length == 0 || adminId[0].adminId != req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not group admin.",
          },
        ],
      };
    }

    const user = await User.findOneBy({ username });
    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "User doesn't exist",
          },
        ],
      };
    }

    const whitelist = new Whitelist();

    whitelist.userId = user.id;
    whitelist.channelId = channelId;

    await whitelist.save();

    return { whitelist };
  }

  @Mutation(() => WhitelistResponse)
  async removeUserFromWhitelist(
    @Arg("username") username: string,
    @Arg("channelId") channelId: number,
    @Ctx() { req }: MyContext
  ) {
    const channel = await Channel.findOneBy({ id: channelId });
    const user = await User.findOneBy({ username });

    if (!channel) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel doesn't exist",
          },
        ],
      };
    }

    if (!user) {
      return {
        errors: [
          {
            field: "userId",
            message: "User doesn't exist",
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

    let adminId = await AppDataSource.query(
      `
SELECT g.adminId FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
WHERE c.id = ? AND g.type = 'group';
    `,
      [channelId]
    );

    if (adminId.length == 0 || adminId[0].adminId != req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not group admin.",
          },
        ],
      };
    }

    if (!(await Whitelist.findOneBy({ userId: user.id, channelId }))) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not in whitelist",
          },
        ],
      };
    }

    await Whitelist.delete({ userId: user.id, channelId });

    const whitelist = await Whitelist.findOneBy({ userId: user.id, channelId });

    return { whitelist };
  }

  @Query(() => UsersResponse)
  async getWhitelist(
    @Arg("channelId") channelId: number,
    @Ctx() { req }: MyContext
  ) {
    const channel = await Channel.findOneBy({ id: channelId });
    if (!channel) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel doesn't exist",
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

    let admin = await AppDataSource.query(
      `
SELECT u.* FROM user u
INNER JOIN \`group\` g ON g.adminId = u.id
INNER JOIN channel c ON c.groupId = g.id
WHERE c.id = ? AND g.type = 'group';
    `,
      [channelId]
    );

    if (admin[0].id.length == 0 || admin[0].id != req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not group admin.",
          },
        ],
      };
    }

    const users = await AppDataSource.query(
      `
SELECT u.* FROM user u
INNER JOIN whitelist w ON w.userId = u.id
WHERE w.channelId = ?;
    `,
      [channelId]
    );

    return { users: users };
  }

  @Query(() => Boolean)
  async isCurrentOnWhitelist(
    @Arg("channelId") channelId: number,
    @Ctx() { req }: MyContext
  ) {
    const channel = await Channel.findOneBy({ id: channelId });

    // channel doesn't exist
    if (!channel) return false;

    // channel is public
    if (channel.isPrivate == false) return true;

    if (typeof req.session.userId === "undefined") return false;

    const whitelist = await Whitelist.findOneBy({
      channelId,
      userId: req.session.userId,
    });

    return !!whitelist;
  }
}
