import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, BaseEntity, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
// @Check(`"user1Id" < "user2Id"`) // typeorm doesn't support check with mysql
export class Friendship extends BaseEntity {
  @Field()
  @PrimaryColumn()
  public user1Id!: number;

  @Field()
  @PrimaryColumn()
  public user2Id!: number;

  @ManyToOne(() => User /*, user => user.friends1*/)
  public user1!: User;

  @ManyToOne(() => User /*, user => user.friends2*/)
  public user2!: User;
}
