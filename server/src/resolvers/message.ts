import { Message } from "../enitities/Message";
import { User } from "../enitities/User";
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
import { MyContext } from "../types";
import { AppDataSource } from "../DataSource";
import { Group } from "../enitities/Group";
import { Group_Has_User } from "../enitities/Group_Has_User";
import { Channel } from "../enitities/Channel";

@ObjectType()
class MessageResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Message, { nullable: true })
  message?: Message;
}

@ObjectType()
class MessagesResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Message], { nullable: true })
  messages?: Message[];

  @Field(() => [User], { nullable: true })
  users: User[];

  @Field(() => Boolean, { nullable: true })
  hasMore: Boolean;
}

@Resolver(Message)
export class MessageResolver {
  @Mutation(() => MessageResponse)
  async sendDM(
    @Arg("msg") msg: string,
    @Arg("receiverId") receiverId: number,
    @Ctx() { req }: MyContext
  ) {
    if ((await User.findBy({ id: receiverId })).length === 0) {
      return {
        errors: [
          {
            field: "receiverId",
            message: "Receiver ID doesn't exist.",
          },
        ],
      };
    }

    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "senderId",
            message: "Sender is not logged in.",
          },
        ],
      };
    }

    if (req.session.userId == receiverId) {
      return {
        errors: [
          {
            field: "receiverId",
            message: "Receiver can't be same as receiver",
          },
        ],
      };
    }

    // check if DM group already exists
    // SELECT g.id FROM `group` g
    // INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    // WHERE userId = 1 AND g.id IN (
    //     SELECT g.id FROM `group` g
    //     INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    //     WHERE userId = 5
    // ) AND g.type = 'dm';

    // sql injection secure - ids can only be numbers
    const dmId = await AppDataSource.manager.query(`
SELECT g.id FROM \`group\` g
INNER JOIN group_has_user ghu ON ghu.groupId = g.id
WHERE userId = ${req.session.userId} AND g.id IN (
    SELECT g.id FROM \`group\` g
    INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    WHERE userId = ${receiverId}
) AND g.type = 'dm';
    `);

    let channelId = 0;

    // dm group doesn't exist yet
    if (dmId.length == 0) {
      // create dm
      const dm = new Group();
      dm.name = req.session.userId + "_" + receiverId;
      dm.type = "dm";

      await dm.save();

      const dm_has_user1 = new Group_Has_User();
      dm_has_user1.userId = req.session.userId;
      dm_has_user1.groupId = dm.id;

      const dm_has_user2 = new Group_Has_User();
      dm_has_user2.userId = receiverId;
      dm_has_user2.groupId = dm.id;

      await dm_has_user1.save();
      await dm_has_user2.save();

      const channel = new Channel();
      channel.groupId = dm.id;
      channel.name = "dm_default";

      await channel.save();

      channelId = channel.id;
    } else {
      // retrive channelId of dm
      channelId = (await Channel.findBy({ groupId: dmId.id }))[0].id;
    }

    let message = new Message();
    message.channelId = channelId;
    message.msg = msg;
    message.senderId = req.session.userId;
    await message.save();

    return { message };
  }

  @Query(() => MessagesResponse, { nullable: true })
  async retrieveDM(
    @Arg("receiverId") receiverId: number,
    @Arg("offset") offset: number,
    @Arg("limit") limit: number,
    @Ctx() { req }: MyContext
  ) {
    if ((await User.findBy({ id: receiverId })).length === 0) {
      return {
        errors: [
          {
            field: "receiverId",
            message: "Receiver ID doesn't exist.",
          },
        ],
      };
    }

    if (typeof req.session.userId === "undefined") {
      return {
        errors: [
          {
            field: "senderId",
            message: "Sender is not logged in.",
          },
        ],
      };
    }

    if (req.session.userId == receiverId) {
      return {
        errors: [
          {
            field: "receiverId",
            message: "Receiver can't be same as receiver",
          },
        ],
      };
    }

    // let messages = await Message.find({ where: [
    //     {
    //       senderId: req.session.userId,
    //       receiverId: receiverId,
    //     },
    //     {
    //       senderId: receiverId,
    //       receiverId: req.session.userId,
    //     },
    //   ],
    // });

    // sql injection secure - ids can only be numbers
    let messages = await AppDataSource.query(
      `
SELECT m.* FROM message m
INNER JOIN channel c ON m.channelId = c.id
INNER JOIN \`group\` g ON c.groupId = g.id
INNER JOIN group_has_user ghu ON ghu.groupId = g.id
WHERE userId = ${req.session.userId} AND g.id IN (
    SELECT g.id FROM \`group\` g
    INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    WHERE userId = ${receiverId}
) AND g.type = 'dm'
ORDER BY m.createdAt DESC
LIMIT ${offset}, ${limit + 1};
`
    );

    let hasMore = messages.length == limit + 1;
    if (hasMore) messages.pop();

    let users: User[] = [];
    let userIds: number[] = [];

    for (const message of messages) {
      if (!userIds.includes(message.senderId)) {
        const sender = await User.findOneBy({ id: message.senderId });
        if (sender != null) {
          users.push(sender);
          userIds.push(sender.id);
          if (userIds.length == 2) break;
        }
      }
    }

    return { messages, users, hasMore };
  }
}
