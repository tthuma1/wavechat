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
import { AppDataSource } from "../DataSource";
import { UsersResponse } from "./user";

@ObjectType()
export class GroupResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group, { nullable: true })
  group?: Group;

  @Field(() => Number, { nullable: true })
  firstChannelId?: number;
}

@ObjectType()
class GroupWithChannel {
  @Field(() => Group)
  group: Group;

  @Field(() => Channel)
  channel: Channel;
}

@ObjectType()
export class GroupsResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [Group], { nullable: true })
  groups?: Group[];

  @Field(() => [Number], { nullable: true })
  firstChannelIds?: number[];
}

@ObjectType()
class GHUResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group_Has_User, { nullable: true })
  ghu?: Group_Has_User;
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

    return { group, firstChannelId: channel.id };
  }

  @Mutation(() => GroupResponse)
  async renameGroup(
    @Ctx() { req }: MyContext,
    @Arg("id") id: number,
    @Arg("newName") newName: string
  ) {
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

    const group = await Group.findOneBy({ id, type: "group" });

    if (!group) {
      return {
        errors: [
          {
            field: "id",
            message: "Group doesn't exist.",
          },
        ],
      };
    }

    if (group.adminId != req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not group admin.",
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

    await Group.update(
      { id },
      {
        name: newName,
      }
    );

    return { group: await Group.findOneBy({ id }) };
  }

  @Mutation(() => GroupResponse)
  async deleteGroup(@Ctx() { req }: MyContext, @Arg("id") id: number) {
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

    const group = await Group.findOneBy({ id, type: "group" });

    if (!group) {
      return {
        errors: [
          {
            field: "id",
            message: "Group doesn't exist.",
          },
        ],
      };
    }

    if (group.adminId != req.session.userId) {
      return {
        errors: [
          {
            field: "userId",
            message: "User is not group admin.",
          },
        ],
      };
    }

    // typeorm doesn't allow cascade delete on many to one relations
    await Channel.delete({ groupId: id });
    await Group_Has_User.delete({ groupId: id });
    await Group.delete({ id });

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

  @Mutation(() => GHUResponse)
  async leaveGroup(@Ctx() { req }: MyContext, @Arg("groupId") groupId: number) {
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
      ).length == 0
    ) {
      return {
        errors: [
          {
            field: "groupId",
            message: "User is not in group",
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

    const ghu = await Group_Has_User.findOneBy({
      groupId,
      userId: req.session.userId,
    });

    await AppDataSource.query(
      `
DELETE FROM group_has_user
WHERE userId = ? AND groupId = ?;
`,
      [req.session.userId, groupId]
    );

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
    let firstChannelIds: number[] = [];

    for (const ghu of ghu_arr) {
      let groupId = ghu.groupId;
      let group = await Group.findOneBy({ id: groupId, type: "group" });

      if (group) {
        groups.push(group);

        let channel = await Channel.findOneBy({ groupId: group.id });
        if (channel) {
          firstChannelIds.push(channel.id);
        }
      }
    }

    return { groups, firstChannelIds };
  }

  @Query(() => GroupsResponse)
  async getUserGroupsCurrent(@Ctx() { req }: MyContext) {
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

    return this.getUserGroups(req.session.userId);
  }

  @Query(() => Boolean)
  async isCurrentInChannel(
    @Ctx() { req }: MyContext,
    @Arg("channelId") channelId: number
  ) {
    if (typeof req.session.userId === "undefined") {
      return false;
    }

    const res = await AppDataSource.query(
      `
SELECT ghu.userId FROM group_has_user ghu
INNER JOIN \`group\` g ON ghu.groupId = g.id
INNER JOIN channel c ON c.groupId = g.id
WHERE ghu.userId = ? AND c.id = ?;
      `,
      [req.session.userId, channelId]
    );

    if (res.length > 0) return true;
    return false;
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

  @Query(() => [GroupWithChannel])
  async searchGroups(@Arg("name") name: string) {
    if (name == "") return [];

    const groups: Group[] = await AppDataSource.query(
      `
SELECT * FROM \`group\`
WHERE type = 'group' AND (LOWER(name) LIKE LOWER(CONCAT('%', ?, '%'))
OR levenshtein(name, ?) <= 2)
ORDER BY levenshtein(name, ?)
LIMIT 15;
`,
      [name, name, name]
    );

    let result: GroupWithChannel[] = [];

    for (const group of groups) {
      let channel = await Channel.findOneBy({ groupId: group.id });
      if (channel) result.push({ group, channel });
    }

    return result;
  }

  @Query(() => GroupResponse)
  async getGroupInfo(@Arg("groupId") groupId: number) {
    const group = await Group.findOneBy({ id: groupId });

    if (group) return { group };
    else
      return {
        errors: [{ field: "groupId", message: "Group doesn't exist." }],
      };
  }
}
