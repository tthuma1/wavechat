import { Group } from "../enitities/Group";
import { Group_Has_User } from "../enitities/Group_Has_User";
import { Channel } from "../enitities/Channel";
import { User } from "../enitities/User";
// import { User } from "../enitities/User";
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

@ObjectType()
export class GroupResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group, { nullable: true })
  group?: Group;
}

@ObjectType()
export class GroupsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Group], { nullable: true })
  groups?: Group[];
}

@ObjectType()
class GHUResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group_Has_User, { nullable: true })
  ghu?: Group_Has_User;
}

@ObjectType()
class UsersResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [User], { nullable: true })
  users?: User[];
}

@ObjectType()
class ChannelsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Channel], { nullable: true })
  channels?: Channel[];
}

@Resolver(Group)
export class GroupResolver {
  @Mutation(() => GroupResponse)
  async createGroup(@Ctx() { req }: MyContext, @Arg("name") name: string) {
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

    let group = new Group();
    group.name = name;
    group.adminId = req.session.userId;
    group.type = "group";

    await group.save();

    const group_has_user = new Group_Has_User();
    group_has_user.userId = req.session.userId;
    group_has_user.groupId = group.id;

    await group_has_user.save();

    const channel = new Channel();
    channel.groupId = group.id;
    channel.name = "general";

    await channel.save();

    return { group };
  }

  @Mutation(() => GHUResponse)
  async joinGroup(@Ctx() { req }: MyContext, @Arg("groupId") groupId: number) {
    if (
      (
        await Group.findBy({
          id: groupId,
        })
      ).length == 0
    ) {
      return {
        errors: [
          {
            field: "groupId",
            message: "Group doesn't exist.",
          },
        ],
      };
    }

    if (
      (
        await Group_Has_User.findBy({
          groupId,
          userId: req.session.userId,
        })
      ).length > 0
    ) {
      return {
        errors: [
          {
            field: "groupId",
            message: "User is already in group.",
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

    let ghu = new Group_Has_User();
    ghu.userId = req.session.userId;
    ghu.groupId = groupId;

    await ghu.save();

    return { ghu };
  }

  @Query(() => GroupsResponse)
  async getUserGroups(@Arg("userId") userId: number) {
    if ((await User.findBy({ id: userId })).length === 0) {
      return {
        errors: [
          {
            field: "userId",
            message: "User ID doesn't exist.",
          },
        ],
      };
    }

    let ghu_arr = await Group_Has_User.findBy({ userId });
    let groups: any[] = [];

    for (const ghu of ghu_arr) {
      let groupId = ghu.groupId;
      let group = await Group.findOneBy({ id: groupId, type: "group" });

      if (group) groups.push(group);
    }

    return { groups };
  }

  @Query(() => UsersResponse)
  async getGroupUsers(@Arg("groupId") groupId: number) {
    if ((await Group.findBy({ id: groupId })).length === 0) {
      return {
        errors: [
          {
            field: "groupdId",
            message: "Group ID doesn't exist.",
          },
        ],
      };
    }

    let ghu_arr = await Group_Has_User.findBy({ groupId });
    let users: any[] = [];

    for (const ghu of ghu_arr) {
      let userId = ghu.userId;
      users.push(await User.findOneBy({ id: userId }));
    }

    return { users };
  }

  @Query(() => ChannelsResponse)
  async getChannelsInGroup(@Arg("groupId") groupId: number) {
    if ((await Group.findBy({ id: groupId })).length === 0) {
      return {
        errors: [
          {
            field: "groupdId",
            message: "Group ID doesn't exist.",
          },
        ],
      };
    }

    let channels = await Channel.findBy({ groupId });

    return { channels };
  }

  @Query(() => GroupResponse)
  async channelToGroup(@Arg("channelId") channelId: number) {
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

    let groupId = (await Channel.findOneBy({ id: channelId }))?.groupId;
    let group = await Group.findOneBy({ id: groupId });

    return { group };
  }
}
