import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  // OneToMany,
  // ManyToMany,
  // JoinTable,
  // ManyToOne,
} from "typeorm";
// import { Message } from "./Message";
// import { Friendship } from "./Friendship";
// import { Group_Has_User } from "./Group_Has_User";
// import { gql } from "apollo-server-express";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({
    length: 50,
    unique: true,
  })
  username!: string;

  @Column("char", { length: 96 })
  password!: string;

  @Field()
  @Column({ length: 320, unique: true })
  email!: string;

  @Field()
  @Column({ default: "default_avatar.png" })
  avatar!: string;

  @Field()
  @Column({ default: false })
  isVerified: boolean;
}
