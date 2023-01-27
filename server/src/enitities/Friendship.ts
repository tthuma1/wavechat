import { Field, ObjectType } from "type-graphql";
import { Entity, ManyToOne, BaseEntity, PrimaryColumn } from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Friendship extends BaseEntity {
  @Field()
  @PrimaryColumn()
  public user1Id: number;

  @Field()
  @PrimaryColumn()
  public user2Id: number;

  @ManyToOne(() => User, user1 => user1.friends1)
  public user1!: User;

  @ManyToOne(() => User, user2 => user2.friends2)
  public user2!: User;
}
