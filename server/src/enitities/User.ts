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

  // @OneToMany(() => Message, message => message.sender)
  // public sentMessages!: Message[];

  // @OneToMany(() => Message, message => message.receiver)
  // public receivedMessages!: Message[];

  // @OneToMany(() => Friendship, friendship => friendship.user1Id)
  // public friends1!: Friendship[];

  // @OneToMany(() => Friendship, friendship => friendship.user2Id)
  // public friends2!: Friendship[];

  // @OneToMany(() => Group_Has_User, group => group.user)
  // public groups!: Group_Has_User[];

  // @ManyToMany(() => User, user => user.friends)
  // @JoinTable({ name: "friendship" })
  // public friends: User[];
}

/*
export const UserTypeDefs = gql`
  type User {
    id: Int!
    username: String!
    email: String
  }

  type FieldError {
    field: String!
    message: String!
  }

  type UserReponse {
    errors: [FieldError]
    user: User
  }

  input UsernamePasswordInput {
    username: String!
    email: String
    password: String!
  }

  type Query {
    user(id: Int): [User]
    me: User
  }

  type Mutation {
    register(username: String!, email: String, password: String!): User!
    login(usernameOrEmail: String!, password: String!): UserReponse!
    logout: Boolean!
  }
`;
*/
