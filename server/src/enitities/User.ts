import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BaseEntity,
  OneToMany,
  // ManyToOne,
} from "typeorm";
import { Message } from "./Message";
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

  @Column("text")
  password!: string;

  @Field({ nullable: true })
  @Column("text", { nullable: true })
  email?: string;

  @OneToMany(() => Message, (message) => message.sender)
  public sentMessages!: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  public receivedMessages!: Message[];
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
