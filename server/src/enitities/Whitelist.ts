import { Field, ObjectType } from "type-graphql";
import { Entity, BaseEntity, PrimaryColumn, ManyToOne } from "typeorm";
import { User } from "./User";
import { Channel } from "./Channel";

@ObjectType()
@Entity()
export class Whitelist extends BaseEntity {
  @Field()
  @PrimaryColumn()
  public userId!: number;

  @Field()
  @PrimaryColumn()
  public channelId!: number;

  @ManyToOne(() => User)
  public user: User;

  @ManyToOne(() => Channel)
  public channel: Channel;
}
