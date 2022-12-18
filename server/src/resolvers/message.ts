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
import { MyContext } from "src/types";

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
}

@Resolver(Message)
export class MessageResolver {
  @Mutation(() => MessageResponse)
  async send(
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

    let message = new Message();
    message.receiverId = receiverId;
    message.msg = msg;
    message.senderId = req.session.userId;
    await message.save();

    return { message };
  }

  @Query(() => MessagesResponse, { nullable: true })
  async retrieve(
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

    let messages = await Message.find({
      where: [
        {
          senderId: req.session.userId,
          receiverId: receiverId,
        },
        {
          senderId: receiverId,
          receiverId: req.session.userId,
        },
      ],
    });

    return { messages };
  }
}
