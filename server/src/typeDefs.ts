import { gql } from "apollo-server-express";

export const typeDefs = gql`
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
