// import { Field, ObjectType } from "type-graphql";
import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./User";

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  messageId!: number;

  @Column()
  public senderId!: number;

  @Column()
  public receiverId!: number;

  @Column("text")
  public msg: string;

  @ManyToOne(() => User, (sender) => sender.sentMessages)
  public sender!: User;

  @ManyToOne(() => User, (receiver) => receiver.receivedMessages)
  public receiver!: User;
}
