import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Channel } from "./Channel";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  senderId!: number;

  @Field()
  @Column()
  public channelId!: number;

  @Field()
  @Column("text")
  public msg!: string;

  @Field()
  @CreateDateColumn()
  public createdAt!: string;

  @Field()
  @Column({ type: "set", enum: ["text", "image", "file"] })
  public type: string;

  @ManyToOne(() => User /*, sender => sender.sentMessages*/)
  public sender!: User;

  @ManyToOne(() => Channel /*, receiver => receiver.receivedMessages*/)
  public channel!: Channel;
}
