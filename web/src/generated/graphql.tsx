import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Channel = {
  __typename?: 'Channel';
  groupId: Scalars['Float'];
  id: Scalars['Float'];
  name: Scalars['String'];
};

export type ChannelResponse = {
  __typename?: 'ChannelResponse';
  channel?: Maybe<Channel>;
  errors?: Maybe<Array<FieldError>>;
};

export type ChannelsResponse = {
  __typename?: 'ChannelsResponse';
  channels?: Maybe<Array<Channel>>;
  errors?: Maybe<Array<FieldError>>;
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Friendship = {
  __typename?: 'Friendship';
  user1Id: Scalars['Float'];
  user2Id: Scalars['Float'];
};

export type FriendshipResponse = {
  __typename?: 'FriendshipResponse';
  errors?: Maybe<Array<FieldError>>;
  friendship?: Maybe<Friendship>;
};

export type GhuResponse = {
  __typename?: 'GHUResponse';
  errors?: Maybe<Array<FieldError>>;
  ghu?: Maybe<Group_Has_User>;
};

export type Group = {
  __typename?: 'Group';
  adminId: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  errors?: Maybe<Array<FieldError>>;
  group?: Maybe<Group>;
};

export type Group_Has_User = {
  __typename?: 'Group_Has_User';
  groupId: Scalars['Float'];
  joinedAt: Scalars['String'];
  userId: Scalars['Float'];
};

export type GroupsResponse = {
  __typename?: 'GroupsResponse';
  errors?: Maybe<Array<FieldError>>;
  groups?: Maybe<Array<Group>>;
};

export type Message = {
  __typename?: 'Message';
  channelId: Scalars['Float'];
  createdAt: Scalars['String'];
  msg: Scalars['String'];
  senderId: Scalars['Float'];
};

export type MessageResponse = {
  __typename?: 'MessageResponse';
  errors?: Maybe<Array<FieldError>>;
  message?: Maybe<Message>;
};

export type MessagesResponse = {
  __typename?: 'MessagesResponse';
  errors?: Maybe<Array<FieldError>>;
  hasMore?: Maybe<Scalars['Boolean']>;
  messages?: Maybe<Array<Message>>;
  users?: Maybe<Array<User>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFriend: FriendshipResponse;
  createChannel: ChannelResponse;
  createGroup: GroupResponse;
  joinGroup: GhuResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  sendDM: MessageResponse;
  sendInChannel: MessageResponse;
};


export type MutationAddFriendArgs = {
  friendId: Scalars['Float'];
};


export type MutationCreateChannelArgs = {
  groupId: Scalars['Float'];
  name: Scalars['String'];
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationJoinGroupArgs = {
  groupId: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationSendDmArgs = {
  msg: Scalars['String'];
  receiverId: Scalars['Float'];
};


export type MutationSendInChannelArgs = {
  channelId: Scalars['Float'];
  msg: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  channelToGroup: GroupResponse;
  getChannelsInGroup: ChannelsResponse;
  getFriends: Array<User>;
  getGroupUsers: UsersResponse;
  getUser: UserResponse;
  getUserGroups: GroupsResponse;
  me?: Maybe<User>;
  retrieveDM?: Maybe<MessagesResponse>;
  retrieveInChannel?: Maybe<MessagesResponse>;
  user: Array<User>;
};


export type QueryChannelToGroupArgs = {
  channelId: Scalars['Float'];
};


export type QueryGetChannelsInGroupArgs = {
  groupId: Scalars['Float'];
};


export type QueryGetFriendsArgs = {
  userId: Scalars['Float'];
};


export type QueryGetGroupUsersArgs = {
  groupId: Scalars['Float'];
};


export type QueryGetUserArgs = {
  id: Scalars['Float'];
};


export type QueryGetUserGroupsArgs = {
  userId: Scalars['Float'];
};


export type QueryRetrieveDmArgs = {
  limit: Scalars['Float'];
  offset: Scalars['Float'];
  receiverId: Scalars['Float'];
};


export type QueryRetrieveInChannelArgs = {
  channelId: Scalars['Float'];
  limit: Scalars['Float'];
  offset: Scalars['Float'];
};


export type QueryUserArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['Float'];
  username: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type UsernamePasswordInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UsersResponse = {
  __typename?: 'UsersResponse';
  errors?: Maybe<Array<FieldError>>;
  users?: Maybe<Array<User>>;
};

export type LoginMutationVariables = Exact<{
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type RegisterMutationVariables = Exact<{
  options: UsernamePasswordInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string, email: string } | null } };

export type SendDmMutationVariables = Exact<{
  receiverId: Scalars['Float'];
  msg: Scalars['String'];
}>;


export type SendDmMutation = { __typename?: 'Mutation', sendDM: { __typename?: 'MessageResponse', message?: { __typename?: 'Message', msg: string, senderId: number, channelId: number, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SendInChannelMutationVariables = Exact<{
  channelId: Scalars['Float'];
  msg: Scalars['String'];
}>;


export type SendInChannelMutation = { __typename?: 'Mutation', sendInChannel: { __typename?: 'MessageResponse', message?: { __typename?: 'Message', msg: string, createdAt: string, channelId: number, senderId: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChannelToGroupQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type ChannelToGroupQuery = { __typename?: 'Query', channelToGroup: { __typename?: 'GroupResponse', group?: { __typename?: 'Group', id: number, name: string } | null } };

export type GetChannelsInGroupQueryVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type GetChannelsInGroupQuery = { __typename?: 'Query', getChannelsInGroup: { __typename?: 'ChannelsResponse', channels?: Array<{ __typename?: 'Channel', id: number, groupId: number, name: string }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetFriendsQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFriendsQuery = { __typename?: 'Query', getFriends: Array<{ __typename?: 'User', username: string, id: number }> };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number } | null } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string } | null };

export type RetrieveDmQueryVariables = Exact<{
  receiverId: Scalars['Float'];
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type RetrieveDmQuery = { __typename?: 'Query', retrieveDM?: { __typename?: 'MessagesResponse', hasMore?: boolean | null, messages?: Array<{ __typename?: 'Message', msg: string, senderId: number, channelId: number, createdAt: string }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, users?: Array<{ __typename?: 'User', username: string, id: number }> | null } | null };

export type RetrieveInChannelQueryVariables = Exact<{
  limit: Scalars['Float'];
  offset: Scalars['Float'];
  channelId: Scalars['Float'];
}>;


export type RetrieveInChannelQuery = { __typename?: 'Query', retrieveInChannel?: { __typename?: 'MessagesResponse', hasMore?: boolean | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, messages?: Array<{ __typename?: 'Message', msg: string, createdAt: string, senderId: number, channelId: number }> | null, users?: Array<{ __typename?: 'User', id: number, username: string }> | null } | null };


export const LoginDocument = gql`
    mutation Login($password: String!, $usernameOrEmail: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      password: // value for 'password'
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: UsernamePasswordInput!) {
  register(options: $options) {
    errors {
      field
      message
    }
    user {
      id
      username
      email
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const SendDmDocument = gql`
    mutation SendDM($receiverId: Float!, $msg: String!) {
  sendDM(receiverId: $receiverId, msg: $msg) {
    message {
      msg
      senderId
      channelId
      createdAt
    }
    errors {
      field
      message
    }
  }
}
    `;
export type SendDmMutationFn = Apollo.MutationFunction<SendDmMutation, SendDmMutationVariables>;

/**
 * __useSendDmMutation__
 *
 * To run a mutation, you first call `useSendDmMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendDmMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendDmMutation, { data, loading, error }] = useSendDmMutation({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      msg: // value for 'msg'
 *   },
 * });
 */
export function useSendDmMutation(baseOptions?: Apollo.MutationHookOptions<SendDmMutation, SendDmMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendDmMutation, SendDmMutationVariables>(SendDmDocument, options);
      }
export type SendDmMutationHookResult = ReturnType<typeof useSendDmMutation>;
export type SendDmMutationResult = Apollo.MutationResult<SendDmMutation>;
export type SendDmMutationOptions = Apollo.BaseMutationOptions<SendDmMutation, SendDmMutationVariables>;
export const SendInChannelDocument = gql`
    mutation SendInChannel($channelId: Float!, $msg: String!) {
  sendInChannel(channelId: $channelId, msg: $msg) {
    message {
      msg
      createdAt
      channelId
      senderId
    }
    errors {
      field
      message
    }
  }
}
    `;
export type SendInChannelMutationFn = Apollo.MutationFunction<SendInChannelMutation, SendInChannelMutationVariables>;

/**
 * __useSendInChannelMutation__
 *
 * To run a mutation, you first call `useSendInChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendInChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendInChannelMutation, { data, loading, error }] = useSendInChannelMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      msg: // value for 'msg'
 *   },
 * });
 */
export function useSendInChannelMutation(baseOptions?: Apollo.MutationHookOptions<SendInChannelMutation, SendInChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendInChannelMutation, SendInChannelMutationVariables>(SendInChannelDocument, options);
      }
export type SendInChannelMutationHookResult = ReturnType<typeof useSendInChannelMutation>;
export type SendInChannelMutationResult = Apollo.MutationResult<SendInChannelMutation>;
export type SendInChannelMutationOptions = Apollo.BaseMutationOptions<SendInChannelMutation, SendInChannelMutationVariables>;
export const ChannelToGroupDocument = gql`
    query ChannelToGroup($channelId: Float!) {
  channelToGroup(channelId: $channelId) {
    group {
      id
      name
    }
  }
}
    `;

/**
 * __useChannelToGroupQuery__
 *
 * To run a query within a React component, call `useChannelToGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useChannelToGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useChannelToGroupQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useChannelToGroupQuery(baseOptions: Apollo.QueryHookOptions<ChannelToGroupQuery, ChannelToGroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ChannelToGroupQuery, ChannelToGroupQueryVariables>(ChannelToGroupDocument, options);
      }
export function useChannelToGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ChannelToGroupQuery, ChannelToGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ChannelToGroupQuery, ChannelToGroupQueryVariables>(ChannelToGroupDocument, options);
        }
export type ChannelToGroupQueryHookResult = ReturnType<typeof useChannelToGroupQuery>;
export type ChannelToGroupLazyQueryHookResult = ReturnType<typeof useChannelToGroupLazyQuery>;
export type ChannelToGroupQueryResult = Apollo.QueryResult<ChannelToGroupQuery, ChannelToGroupQueryVariables>;
export const GetChannelsInGroupDocument = gql`
    query GetChannelsInGroup($groupId: Float!) {
  getChannelsInGroup(groupId: $groupId) {
    channels {
      id
      groupId
      name
    }
    errors {
      field
      message
    }
  }
}
    `;

/**
 * __useGetChannelsInGroupQuery__
 *
 * To run a query within a React component, call `useGetChannelsInGroupQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelsInGroupQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelsInGroupQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetChannelsInGroupQuery(baseOptions: Apollo.QueryHookOptions<GetChannelsInGroupQuery, GetChannelsInGroupQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelsInGroupQuery, GetChannelsInGroupQueryVariables>(GetChannelsInGroupDocument, options);
      }
export function useGetChannelsInGroupLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelsInGroupQuery, GetChannelsInGroupQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelsInGroupQuery, GetChannelsInGroupQueryVariables>(GetChannelsInGroupDocument, options);
        }
export type GetChannelsInGroupQueryHookResult = ReturnType<typeof useGetChannelsInGroupQuery>;
export type GetChannelsInGroupLazyQueryHookResult = ReturnType<typeof useGetChannelsInGroupLazyQuery>;
export type GetChannelsInGroupQueryResult = Apollo.QueryResult<GetChannelsInGroupQuery, GetChannelsInGroupQueryVariables>;
export const GetFriendsDocument = gql`
    query GetFriends($userId: Float!) {
  getFriends(userId: $userId) {
    username
    id
  }
}
    `;

/**
 * __useGetFriendsQuery__
 *
 * To run a query within a React component, call `useGetFriendsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetFriendsQuery(baseOptions: Apollo.QueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
      }
export function useGetFriendsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsQuery, GetFriendsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsQuery, GetFriendsQueryVariables>(GetFriendsDocument, options);
        }
export type GetFriendsQueryHookResult = ReturnType<typeof useGetFriendsQuery>;
export type GetFriendsLazyQueryHookResult = ReturnType<typeof useGetFriendsLazyQuery>;
export type GetFriendsQueryResult = Apollo.QueryResult<GetFriendsQuery, GetFriendsQueryVariables>;
export const GetUserDocument = gql`
    query getUser($id: Float!) {
  getUser(id: $id) {
    user {
      id
    }
  }
}
    `;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const RetrieveDmDocument = gql`
    query RetrieveDM($receiverId: Float!, $offset: Float!, $limit: Float!) {
  retrieveDM(receiverId: $receiverId, offset: $offset, limit: $limit) {
    messages {
      msg
      senderId
      channelId
      createdAt
    }
    errors {
      field
      message
    }
    users {
      username
      id
    }
    hasMore
  }
}
    `;

/**
 * __useRetrieveDmQuery__
 *
 * To run a query within a React component, call `useRetrieveDmQuery` and pass it any options that fit your needs.
 * When your component renders, `useRetrieveDmQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRetrieveDmQuery({
 *   variables: {
 *      receiverId: // value for 'receiverId'
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useRetrieveDmQuery(baseOptions: Apollo.QueryHookOptions<RetrieveDmQuery, RetrieveDmQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RetrieveDmQuery, RetrieveDmQueryVariables>(RetrieveDmDocument, options);
      }
export function useRetrieveDmLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RetrieveDmQuery, RetrieveDmQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RetrieveDmQuery, RetrieveDmQueryVariables>(RetrieveDmDocument, options);
        }
export type RetrieveDmQueryHookResult = ReturnType<typeof useRetrieveDmQuery>;
export type RetrieveDmLazyQueryHookResult = ReturnType<typeof useRetrieveDmLazyQuery>;
export type RetrieveDmQueryResult = Apollo.QueryResult<RetrieveDmQuery, RetrieveDmQueryVariables>;
export const RetrieveInChannelDocument = gql`
    query RetrieveInChannel($limit: Float!, $offset: Float!, $channelId: Float!) {
  retrieveInChannel(limit: $limit, offset: $offset, channelId: $channelId) {
    hasMore
    errors {
      field
      message
    }
    messages {
      msg
      createdAt
      senderId
      channelId
    }
    users {
      id
      username
    }
  }
}
    `;

/**
 * __useRetrieveInChannelQuery__
 *
 * To run a query within a React component, call `useRetrieveInChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useRetrieveInChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRetrieveInChannelQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      offset: // value for 'offset'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useRetrieveInChannelQuery(baseOptions: Apollo.QueryHookOptions<RetrieveInChannelQuery, RetrieveInChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RetrieveInChannelQuery, RetrieveInChannelQueryVariables>(RetrieveInChannelDocument, options);
      }
export function useRetrieveInChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RetrieveInChannelQuery, RetrieveInChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RetrieveInChannelQuery, RetrieveInChannelQueryVariables>(RetrieveInChannelDocument, options);
        }
export type RetrieveInChannelQueryHookResult = ReturnType<typeof useRetrieveInChannelQuery>;
export type RetrieveInChannelLazyQueryHookResult = ReturnType<typeof useRetrieveInChannelLazyQuery>;
export type RetrieveInChannelQueryResult = Apollo.QueryResult<RetrieveInChannelQuery, RetrieveInChannelQueryVariables>;