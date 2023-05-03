import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { FieldError } from "./FieldError";
import { Channel } from "../enitities/Channel";
import { AppDataSource } from "../DataSource";
import { MyContext } from "../types";
import { Blacklist } from "../enitities/Blacklist";

@ObjectType()
class BlacklistResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Blacklist, { nullable: true })
  blacklist?: Blacklist;
}

@Resolver(Blacklist)
export class BlacklistResolver {
  @Mutation(() => BlacklistResponse)
  async addUserToBlacklist(
    @Arg("userId") userId: number,
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

    const blacklist = new Blacklist();
    blacklist.userId = userId;
    blacklist.channelId = channelId;

    await blacklist.save();

    return { blacklist };
  }
}
