import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Group } from "./Group";
// import { Group } from "./Group";
import { User } from "./User";

@ObjectType()
@Entity()
export class Group_Has_User extends BaseEntity {
  @Field()
  @PrimaryColumn()
  public userId!: number;

  @Field()
  @PrimaryColumn()
  public groupId!: number;

  @Field()
  @CreateDateColumn()
  public joinedAt!: string;

  @ManyToOne(() => User /*, user => user.groups*/)
  public user: User;

  @ManyToOne(() => Group)
  public group: Group;
}
