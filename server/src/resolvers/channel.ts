import { Group } from "../enitities/Group";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { FieldError } from "./FieldError";
import { MyContext } from "src/types";
import { Channel } from "../enitities/Channel";

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
}
