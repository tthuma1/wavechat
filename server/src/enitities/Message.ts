// import { Field, ObjectType } from "type-graphql";
import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
} from "typeorm";
import { User } from "./User";

@ObjectType()
@Entity()
export class Message extends BaseEntity {
  @PrimaryGeneratedColumn()
  messageId!: number;

  @Field()
  @Column()
  public senderId!: number;

  @Field()
  @Column()
  public receiverId!: number;

  @Field()
  @Column("text")
  public msg: string;

  @ManyToOne(() => User, (sender) => sender.sentMessages)
  public sender!: User;

  @ManyToOne(() => User, (receiver) => receiver.receivedMessages)
  public receiver!: User;
}
