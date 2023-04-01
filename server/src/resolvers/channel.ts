import { Group } from "../enitities/Group";
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
import { UsersResponse } from "./user";
import { AppDataSource } from "../DataSource";
import { User } from "../enitities/User";
import { MyContext } from "../types";

@ObjectType()
export class ChannelResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Channel, { nullable: true })
  channel?: Channel;
}

@Resolver(Channel)
export class ChannelResolver {
  @Mutation(() => ChannelResponse)
  async createChannel(
    @Arg("name") name: string,
    @Arg("groupId") groupId: number
  ) {
    if ((await Group.findBy({ id: groupId })).length == 0) {
      return {
        errors: [
          {
            field: "groupId",
            message: "Group doesn't exist.",
          },
        ],
      };
    }

    if (name == "") {
      return {
        errors: [
          {
            field: "name",
            message: "Name cannot be empty.",
          },
        ],
      };
    }

    let channel = new Channel();
    channel.name = name;
    channel.groupId = groupId;

    await channel.save();

    return { channel };
  }

  @Mutation(() => Number)
  async deleteChannel(@Arg("id") id: number, @Ctx() { req }: MyContext) {
    // not logged in
    if (typeof req.session.userId === "undefined") return -1;

    let channel = await Channel.findOneBy({ id });

    // channel doesn't exist
    if (!channel) return -1;

    let adminId = await AppDataSource.query(
      `
SELECT g.adminId FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
WHERE c.id = ? AND g.type = 'group';
    `,
      [id]
    );

    if (adminId.length == 0) return -1;
    adminId = adminId[0].adminId;

    // non admin tries deleting a channel
    if (req.session.userId != adminId) return -1;

    // can't delete only channel
    let groupId = (await Channel.findOneBy({ id }))?.groupId;
    let channels = await AppDataSource.query(
      `
SELECT c.id FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
WHERE g.id = ? AND g.type = 'group'
    `,
      [groupId]
    );

    if (channels.length == 1) return -1;

    await Channel.delete({ id });

    channels = await AppDataSource.query(
      `
SELECT c.id FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
WHERE g.id = ? AND g.type = 'group'
    `,
      [groupId]
    );

    return channels[0].id;
  }

  @Mutation(() => ChannelResponse)
  async renameChannel(
    @Arg("channelId") id: number,
    @Arg("newName") newName: string,
    @Ctx() { req }: MyContext
  ) {
    const channel = await Channel.findOneBy({ id });
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

    if (newName == "") {
      return {
        errors: [
          {
            field: "name",
            message: "Name cannot be empty.",
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
      [id]
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

    if (adminId.length == 0) return false;

    await Channel.update(
      { id },
      {
        name: newName,
      }
    );

    return { channel: await Channel.findOneBy({ id }) };
  }

  @Query(() => ChannelResponse)
  async getChannelInfo(@Arg("channelId") channelId: number) {
    const res = await Channel.findOneBy({ id: channelId });
    if (!res) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel doesn't exist",
          },
        ],
      };
    }

    return { channel: res };
  }

  @Query(() => UsersResponse)
  async getUsersInChannel(@Arg("channelId") channelId: number) {
    if (!(await Channel.findOneBy({ id: channelId }))) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel doesn't exist",
          },
        ],
      };
    }

    const users: User[] = await AppDataSource.query(
      `
SELECT u.* FROM channel c
INNER JOIN \`group\` g ON g.id = c.groupId
INNER JOIN group_has_user ghu ON ghu.groupId = g.id
INNER JOIN user u ON u.id = ghu.userId
WHERE c.id = ?;
      `,
      [channelId]
    );

    return { users };
  }
}
