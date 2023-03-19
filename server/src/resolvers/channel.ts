import { Group } from "../enitities/Group";
import {
  Arg,
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

    let channel = new Channel();
    channel.name = name;
    channel.groupId = groupId;

    await channel.save();

    return { channel };
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
