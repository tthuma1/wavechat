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

  @Field(() => Number, { nullable: true })
  newAmount: Number;
}

@Resolver(Message)
export class MessageResolver {
  @Mutation(() => MessageResponse)
  async sendDM(
    @Arg("msg") msg: string,
    @Arg("receiverId") receiverId: number,
    @Arg("type") type: string,
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

    if (msg == "") {
      return {
        errors: [
          {
            field: "msg",
            message: "Message cannot be empty",
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

    const dmId = await AppDataSource.manager.query(
      `
SELECT g.id FROM \`group\` g
INNER JOIN group_has_user ghu ON ghu.groupId = g.id
WHERE userId = ? AND g.id IN (
    SELECT g.id FROM \`group\` g
    INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    WHERE userId = ?
) AND g.type = 'dm';
    `,
      [req.session.userId, receiverId]
    );

    let channelId = 0;

    // dm group doesn't exist yet
    if (dmId.length == 0) {
      // create dm
      const dm = new Group();
      dm.name = req.session.userId + "_" + receiverId;
      dm.type = "dm";
      dm.adminId = req.session.userId;

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
      channelId = (await Channel.findOneBy({ groupId: dmId[0].id }))!.id;
    }

    let message = new Message();
    message.channelId = channelId;
    message.msg = msg;
    message.senderId = req.session.userId;
    message.type = type;
    await message.save();

    return { message };
  }

  @Mutation(() => MessageResponse)
  async sendInChannel(
    @Arg("msg") msg: string,
    @Arg("channelId") channelId: number,
    @Arg("type") type: string,
    @Ctx() { req }: MyContext
  ) {
    if ((await Channel.findBy({ id: channelId })).length === 0) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel ID doesn't exist.",
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

    if (msg == "") {
      return {
        errors: [
          {
            field: "msg",
            message: "Message cannot be empty",
          },
        ],
      };
    }

    let isUserInChannel = !!(
      await AppDataSource.query(
        `
SELECT ghu.userId FROM channel c
INNER JOIN group_has_user ghu ON ghu.groupId = c.groupId
WHERE c.id = ? AND ghu.userId = ?;
`,
        [channelId, req.session.userId]
      )
    ).length;

    if (!isUserInChannel) {
      return {
        errors: [
          {
            field: "senderId",
            message: "Sender is not in group.",
          },
        ],
      };
    }

    let message = new Message();
    message.channelId = channelId;
    message.msg = msg;
    message.senderId = req.session.userId;
    message.type = type;
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
WHERE userId = ? AND g.id IN (
    SELECT g.id FROM \`group\` g
    INNER JOIN group_has_user ghu ON ghu.groupId = g.id
    WHERE userId = ?
) AND g.type = 'dm'
ORDER BY m.createdAt DESC
LIMIT ?, ?;
`,
      [req.session.userId, receiverId, offset, limit + 1]
    );

    let hasMore = messages.length == limit + 1;
    if (hasMore) messages.pop();

    // let users: User[] = [];
    let users = await User.find({
      where: [{ id: receiverId }, { id: req.session.userId }],
    });

    // let userIds: number[] = [];

    // for (const message of messages) {
    //   if (!userIds.includes(message.senderId)) {
    //     const sender = await User.findOneBy({ id: message.senderId });
    //     if (sender != null) {
    //       users.push(sender);
    //       userIds.push(sender.id);
    //       if (userIds.length == 2) break;
    //     }
    //   }
    // }

    return { messages, users, hasMore, newAmount: messages.length };
  }

  @Query(() => MessagesResponse, { nullable: true })
  async retrieveInChannel(
    @Arg("channelId") channelId: number,
    @Arg("offset") offset: number,
    @Arg("limit") limit: number,
    @Ctx() { req }: MyContext
  ) {
    if ((await Channel.findBy({ id: channelId })).length === 0) {
      return {
        errors: [
          {
            field: "channelId",
            message: "Channel ID doesn't exist.",
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

    let isUserInChannel = !!(
      await AppDataSource.query(
        `
SELECT ghu.userId FROM channel c
INNER JOIN group_has_user ghu ON ghu.groupId = c.groupId
WHERE c.id = ? AND ghu.userId = ?;
`,
        [channelId, req.session.userId]
      )
    ).length;

    if (!isUserInChannel) {
      return {
        errors: [
          {
            field: "senderId",
            message: "Sender is not in group.",
          },
        ],
      };
    }

    let messages = await AppDataSource.query(
      `
SELECT m.* FROM message m
WHERE m.channelId = ?
ORDER BY m.createdAt DESC
LIMIT ?, ?;
`,
      [channelId, offset, limit + 1]
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
        }
      }
    }

    return { messages, users, hasMore };
  }

  @Mutation(() => MessageResponse)
  async deleteMessage(@Arg("id") id: number, @Ctx() { req }: MyContext) {
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

    const message = await Message.findOneBy({ id });

    if (!message) {
      return {
        errors: [
          {
            field: "id",
            message: "Message doesn't exist",
          },
        ],
      };
    }

    const group = (
      await AppDataSource.query(
        `
SELECT g.* FROM \`group\` g
INNER JOIN channel c ON c.groupId = g.id
INNER JOIN message m ON m.channelId = c.id
WHERE m.id = ?
    `,
        [id]
      )
    )[0];

    console.log(group);

    if (
      (group.type == "dm" && message.senderId != req.session.userId) ||
      (group.type == "group" &&
        message.senderId != req.session.userId &&
        group.adminId != req.session.userId)
    ) {
      return {
        errors: [
          {
            field: "senderId",
            message: "Can't delete another user's message",
          },
        ],
      };
    }

    await Message.delete({ id });

    message.type = message.type[0];

    return { message };
  }
}
