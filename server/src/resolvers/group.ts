import { Group } from "../enitities/Group";
import { User } from "../enitities/User";
import { Arg, Ctx, Field, Mutation, ObjectType, Resolver } from "type-graphql";
import { FieldError } from "./FieldError";
import { MyContext } from "src/types";

@ObjectType()
export class GroupResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => Group, { nullable: true })
  group?: Group;
}

@Resolver(Group)
export class GroupResolver {
  @Mutation(() => GroupResponse)
  async createGroup(@Arg("name") name: string) {
    let group = new Group();
    group.name = name;

    await group.save();

    return { group };
  }
}
