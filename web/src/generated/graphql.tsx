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

export type Blacklist = {
  __typename?: 'Blacklist';
  channelId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type BlacklistResponse = {
  __typename?: 'BlacklistResponse';
  blacklist?: Maybe<Blacklist>;
  errors?: Maybe<Array<FieldError>>;
};

export type Channel = {
  __typename?: 'Channel';
  groupId: Scalars['Float'];
  id: Scalars['Float'];
  isPrivate: Scalars['Boolean'];
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

export type GhuWithChannelResponse = {
  __typename?: 'GHUWithChannelResponse';
  errors?: Maybe<Array<FieldError>>;
  firstChannelId?: Maybe<Scalars['Float']>;
  ghu?: Maybe<Group_Has_User>;
};

export type Group = {
  __typename?: 'Group';
  adminId: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  isPrivate: Scalars['Boolean'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type GroupResponse = {
  __typename?: 'GroupResponse';
  errors?: Maybe<Array<FieldError>>;
  firstChannelId?: Maybe<Scalars['Float']>;
  group?: Maybe<Group>;
};

export type GroupWithChannel = {
  __typename?: 'GroupWithChannel';
  channel: Channel;
  group: Group;
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
  firstChannelIds?: Maybe<Array<Scalars['Float']>>;
  groups?: Maybe<Array<Group>>;
};

export type Message = {
  __typename?: 'Message';
  channelId: Scalars['Float'];
  createdAt: Scalars['String'];
  id: Scalars['Float'];
  msg: Scalars['String'];
  senderId: Scalars['Float'];
  type: Scalars['String'];
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
  newAmount?: Maybe<Scalars['Float']>;
  users?: Maybe<Array<User>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addFriend: FriendshipResponse;
  addUserToBlacklist: BlacklistResponse;
  addUserToWhitelist: WhitelistResponse;
  changeAvatar: UserResponse;
  changeEmail: UserResponse;
  changePassword: UserResponse;
  changePasswordToken: UserResponse;
  changeUsername: UserResponse;
  createChannel: ChannelResponse;
  createGroup: GroupResponse;
  deleteChannel: Scalars['Float'];
  deleteGroup: GroupResponse;
  deleteMessage: MessageResponse;
  forgotPassword: Scalars['Boolean'];
  generateInvite: Scalars['String'];
  joinGroup: GhuResponse;
  joinGroupWithToken: GhuWithChannelResponse;
  kickUser: UserResponse;
  leaveGroup: GhuResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  register: UserResponse;
  removeFriend: FriendshipResponse;
  removeUserFromWhitelist: WhitelistResponse;
  renameChannel: ChannelResponse;
  renameGroup: GroupResponse;
  sendDM: MessageResponse;
  sendInChannel: MessageResponse;
  toggleGroupVisibility: GroupResponse;
  toggleVisibility: ChannelResponse;
  verifyEmail: UserResponse;
};


export type MutationAddFriendArgs = {
  friendId: Scalars['Float'];
};


export type MutationAddUserToBlacklistArgs = {
  channelId: Scalars['Float'];
  userId: Scalars['Float'];
};


export type MutationAddUserToWhitelistArgs = {
  channelId: Scalars['Float'];
  username: Scalars['String'];
};


export type MutationChangeAvatarArgs = {
  filename: Scalars['String'];
};


export type MutationChangeEmailArgs = {
  newEmail: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
};


export type MutationChangePasswordTokenArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationChangeUsernameArgs = {
  newUsername: Scalars['String'];
};


export type MutationCreateChannelArgs = {
  groupId: Scalars['Float'];
  name: Scalars['String'];
};


export type MutationCreateGroupArgs = {
  name: Scalars['String'];
};


export type MutationDeleteChannelArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteGroupArgs = {
  id: Scalars['Float'];
};


export type MutationDeleteMessageArgs = {
  id: Scalars['Float'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationGenerateInviteArgs = {
  groupId: Scalars['Float'];
};


export type MutationJoinGroupArgs = {
  groupId: Scalars['Float'];
};


export type MutationJoinGroupWithTokenArgs = {
  token: Scalars['String'];
};


export type MutationKickUserArgs = {
  groupId: Scalars['Float'];
  userId: Scalars['Float'];
};


export type MutationLeaveGroupArgs = {
  groupId: Scalars['Float'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationRegisterArgs = {
  options: UsernamePasswordInput;
};


export type MutationRemoveFriendArgs = {
  friendId: Scalars['Float'];
};


export type MutationRemoveUserFromWhitelistArgs = {
  channelId: Scalars['Float'];
  username: Scalars['String'];
};


export type MutationRenameChannelArgs = {
  channelId: Scalars['Float'];
  newName: Scalars['String'];
};


export type MutationRenameGroupArgs = {
  id: Scalars['Float'];
  newName: Scalars['String'];
};


export type MutationSendDmArgs = {
  msg: Scalars['String'];
  receiverId: Scalars['Float'];
  type: Scalars['String'];
};


export type MutationSendInChannelArgs = {
  channelId: Scalars['Float'];
  msg: Scalars['String'];
  type: Scalars['String'];
};


export type MutationToggleGroupVisibilityArgs = {
  groupId: Scalars['Float'];
};


export type MutationToggleVisibilityArgs = {
  channelId: Scalars['Float'];
};


export type MutationVerifyEmailArgs = {
  token: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  channelToGroup: GroupResponse;
  getChannelInfo: ChannelResponse;
  getChannelsInGroup: ChannelsResponse;
  getFriends: Array<User>;
  getFriendsCurrent: UsersResponse;
  getGroupInfo: GroupResponse;
  getGroupUsers: UsersResponse;
  getUser: UserResponse;
  getUserGroups: GroupsResponse;
  getUserGroupsCurrent: GroupsResponse;
  getUsersInChannel: UsersResponse;
  getWhitelist: UsersResponse;
  isCurrentInChannel: Scalars['Boolean'];
  isCurrentOnWhitelist: Scalars['Boolean'];
  me?: Maybe<User>;
  retrieveDM?: Maybe<MessagesResponse>;
  retrieveInChannel?: Maybe<MessagesResponse>;
  searchGroups: Array<GroupWithChannel>;
  searchUsers: UsersResponse;
};


export type QueryChannelToGroupArgs = {
  channelId: Scalars['Float'];
};


export type QueryGetChannelInfoArgs = {
  channelId: Scalars['Float'];
};


export type QueryGetChannelsInGroupArgs = {
  groupId: Scalars['Float'];
};


export type QueryGetFriendsArgs = {
  userId: Scalars['Float'];
};


export type QueryGetGroupInfoArgs = {
  groupId: Scalars['Float'];
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


export type QueryGetUsersInChannelArgs = {
  channelId: Scalars['Float'];
};


export type QueryGetWhitelistArgs = {
  channelId: Scalars['Float'];
};


export type QueryIsCurrentInChannelArgs = {
  channelId: Scalars['Float'];
};


export type QueryIsCurrentOnWhitelistArgs = {
  channelId: Scalars['Float'];
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


export type QuerySearchGroupsArgs = {
  name: Scalars['String'];
};


export type QuerySearchUsersArgs = {
  username: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  avatar: Scalars['String'];
  email: Scalars['String'];
  id: Scalars['Float'];
  isVerified: Scalars['Boolean'];
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

export type Whitelist = {
  __typename?: 'Whitelist';
  channelId: Scalars['Float'];
  userId: Scalars['Float'];
};

export type WhitelistResponse = {
  __typename?: 'WhitelistResponse';
  errors?: Maybe<Array<FieldError>>;
  whitelist?: Maybe<Whitelist>;
};

export type AddFriendMutationVariables = Exact<{
  friendId: Scalars['Float'];
}>;


export type AddFriendMutation = { __typename?: 'Mutation', addFriend: { __typename?: 'FriendshipResponse', friendship?: { __typename?: 'Friendship', user1Id: number, user2Id: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type RemoveFriendMutationVariables = Exact<{
  friendId: Scalars['Float'];
}>;


export type RemoveFriendMutation = { __typename?: 'Mutation', removeFriend: { __typename?: 'FriendshipResponse', friendship?: { __typename?: 'Friendship', user1Id: number, user2Id: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangePasswordTokenMutationVariables = Exact<{
  newPassword: Scalars['String'];
  token: Scalars['String'];
}>;


export type ChangePasswordTokenMutation = { __typename?: 'Mutation', changePasswordToken: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string, avatar: string, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangeUsernameMutationVariables = Exact<{
  newUsername: Scalars['String'];
}>;


export type ChangeUsernameMutation = { __typename?: 'Mutation', changeUsername: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateChannelMutationVariables = Exact<{
  groupId: Scalars['Float'];
  name: Scalars['String'];
}>;


export type CreateChannelMutation = { __typename?: 'Mutation', createChannel: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: number, name: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type CreateGroupMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type CreateGroupMutation = { __typename?: 'Mutation', createGroup: { __typename?: 'GroupResponse', firstChannelId?: number | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, group?: { __typename?: 'Group', name: string, createdAt: string } | null } };

export type DeleteChannelMutationVariables = Exact<{
  deleteChannelId: Scalars['Float'];
}>;


export type DeleteChannelMutation = { __typename?: 'Mutation', deleteChannel: number };

export type DeleteGroupMutationVariables = Exact<{
  deleteGroupId: Scalars['Float'];
}>;


export type DeleteGroupMutation = { __typename?: 'Mutation', deleteGroup: { __typename?: 'GroupResponse', group?: { __typename?: 'Group', id: number, name: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgotPasswordMutation = { __typename?: 'Mutation', forgotPassword: boolean };

export type JoinGroupMutationVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type JoinGroupMutation = { __typename?: 'Mutation', joinGroup: { __typename?: 'GHUResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, ghu?: { __typename?: 'Group_Has_User', groupId: number } | null } };

export type GenerateInviteMutationVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type GenerateInviteMutation = { __typename?: 'Mutation', generateInvite: string };

export type JoinGroupWithTokenMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type JoinGroupWithTokenMutation = { __typename?: 'Mutation', joinGroupWithToken: { __typename?: 'GHUWithChannelResponse', firstChannelId?: number | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, ghu?: { __typename?: 'Group_Has_User', userId: number, groupId: number, joinedAt: string } | null } };

export type KickUserMutationVariables = Exact<{
  userId: Scalars['Float'];
  groupId: Scalars['Float'];
}>;


export type KickUserMutation = { __typename?: 'Mutation', kickUser: { __typename?: 'UserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, user?: { __typename?: 'User', id: number, username: string } | null } };

export type LeaveGroupMutationVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type LeaveGroupMutation = { __typename?: 'Mutation', leaveGroup: { __typename?: 'GHUResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, ghu?: { __typename?: 'Group_Has_User', groupId: number, userId: number } | null } };

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

export type RenameChannelMutationVariables = Exact<{
  newName: Scalars['String'];
  channelId: Scalars['Float'];
}>;


export type RenameChannelMutation = { __typename?: 'Mutation', renameChannel: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: number, name: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type RenameGroupMutationVariables = Exact<{
  newName: Scalars['String'];
  renameGroupId: Scalars['Float'];
}>;


export type RenameGroupMutation = { __typename?: 'Mutation', renameGroup: { __typename?: 'GroupResponse', group?: { __typename?: 'Group', id: number, name: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SendDmMutationVariables = Exact<{
  receiverId: Scalars['Float'];
  msg: Scalars['String'];
  type: Scalars['String'];
}>;


export type SendDmMutation = { __typename?: 'Mutation', sendDM: { __typename?: 'MessageResponse', message?: { __typename?: 'Message', msg: string, senderId: number, channelId: number, createdAt: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type SendInChannelMutationVariables = Exact<{
  channelId: Scalars['Float'];
  msg: Scalars['String'];
  type: Scalars['String'];
}>;


export type SendInChannelMutation = { __typename?: 'Mutation', sendInChannel: { __typename?: 'MessageResponse', message?: { __typename?: 'Message', msg: string, createdAt: string, channelId: number, senderId: number } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangeAvatarMutationVariables = Exact<{
  filename: Scalars['String'];
}>;


export type ChangeAvatarMutation = { __typename?: 'Mutation', changeAvatar: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, avatar: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangeEmailMutationVariables = Exact<{
  newEmail: Scalars['String'];
}>;


export type ChangeEmailMutation = { __typename?: 'Mutation', changeEmail: { __typename?: 'UserResponse', user?: { __typename?: 'User', email: string, id: number, username: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ChangePasswordMutationVariables = Exact<{
  newPassword: Scalars['String'];
  oldPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, email: string, username: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type ToggleVisibilityMutationVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type ToggleVisibilityMutation = { __typename?: 'Mutation', toggleVisibility: { __typename?: 'ChannelResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, channel?: { __typename?: 'Channel', id: number, name: string, groupId: number, isPrivate: boolean } | null } };

export type ToggleGroupVisibilityMutationVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type ToggleGroupVisibilityMutation = { __typename?: 'Mutation', toggleGroupVisibility: { __typename?: 'GroupResponse', firstChannelId?: number | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, group?: { __typename?: 'Group', id: number, adminId: number, name: string, createdAt: string, type: string, isPrivate: boolean } | null } };

export type VerifyEmailMutationVariables = Exact<{
  token: Scalars['String'];
}>;


export type VerifyEmailMutation = { __typename?: 'Mutation', verifyEmail: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type AddUserToWhitelistMutationVariables = Exact<{
  channelId: Scalars['Float'];
  username: Scalars['String'];
}>;


export type AddUserToWhitelistMutation = { __typename?: 'Mutation', addUserToWhitelist: { __typename?: 'WhitelistResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, whitelist?: { __typename?: 'Whitelist', userId: number, channelId: number } | null } };

export type RemoveUserFromWhitelistMutationVariables = Exact<{
  channelId: Scalars['Float'];
  username: Scalars['String'];
}>;


export type RemoveUserFromWhitelistMutation = { __typename?: 'Mutation', removeUserFromWhitelist: { __typename?: 'WhitelistResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, whitelist?: { __typename?: 'Whitelist', userId: number, channelId: number } | null } };

export type ChannelToGroupQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type ChannelToGroupQuery = { __typename?: 'Query', channelToGroup: { __typename?: 'GroupResponse', group?: { __typename?: 'Group', id: number, name: string, adminId: number } | null } };

export type DeleteMessageMutationVariables = Exact<{
  deleteMessageId: Scalars['Float'];
}>;


export type DeleteMessageMutation = { __typename?: 'Mutation', deleteMessage: { __typename?: 'MessageResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, message?: { __typename?: 'Message', senderId: number, channelId: number, msg: string, createdAt: string, type: string } | null } };

export type GetChannelsInGroupQueryVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type GetChannelsInGroupQuery = { __typename?: 'Query', getChannelsInGroup: { __typename?: 'ChannelsResponse', channels?: Array<{ __typename?: 'Channel', id: number, groupId: number, name: string, isPrivate: boolean }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetChannelInfoQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type GetChannelInfoQuery = { __typename?: 'Query', getChannelInfo: { __typename?: 'ChannelResponse', channel?: { __typename?: 'Channel', id: number, name: string, isPrivate: boolean } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetFriendsQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetFriendsQuery = { __typename?: 'Query', getFriends: Array<{ __typename?: 'User', username: string, id: number, avatar: string }> };

export type GetFriendsCurrentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFriendsCurrentQuery = { __typename?: 'Query', getFriendsCurrent: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, users?: Array<{ __typename?: 'User', id: number }> | null } };

export type GetGroupInfoQueryVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type GetGroupInfoQuery = { __typename?: 'Query', getGroupInfo: { __typename?: 'GroupResponse', group?: { __typename?: 'Group', id: number, name: string, adminId: number, isPrivate: boolean } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetGroupUsersQueryVariables = Exact<{
  groupId: Scalars['Float'];
}>;


export type GetGroupUsersQuery = { __typename?: 'Query', getGroupUsers: { __typename?: 'UsersResponse', users?: Array<{ __typename?: 'User', id: number, username: string, avatar: string }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetUserQueryVariables = Exact<{
  id: Scalars['Float'];
}>;


export type GetUserQuery = { __typename?: 'Query', getUser: { __typename?: 'UserResponse', user?: { __typename?: 'User', id: number, username: string, avatar: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null } };

export type GetUserGroupsQueryVariables = Exact<{
  userId: Scalars['Float'];
}>;


export type GetUserGroupsQuery = { __typename?: 'Query', getUserGroups: { __typename?: 'GroupsResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, groups?: Array<{ __typename?: 'Group', id: number, name: string, createdAt: string }> | null } };

export type GetUserGroupsCurrentQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserGroupsCurrentQuery = { __typename?: 'Query', getUserGroupsCurrent: { __typename?: 'GroupsResponse', firstChannelIds?: Array<number> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, groups?: Array<{ __typename?: 'Group', id: number, name: string }> | null } };

export type IsCurrentInChannelQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type IsCurrentInChannelQuery = { __typename?: 'Query', isCurrentInChannel: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, username: string, email: string, avatar: string } | null };

export type RetrieveDmQueryVariables = Exact<{
  receiverId: Scalars['Float'];
  offset: Scalars['Float'];
  limit: Scalars['Float'];
}>;


export type RetrieveDmQuery = { __typename?: 'Query', retrieveDM?: { __typename?: 'MessagesResponse', hasMore?: boolean | null, newAmount?: number | null, messages?: Array<{ __typename?: 'Message', id: number, msg: string, senderId: number, channelId: number, createdAt: string, type: string }> | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, users?: Array<{ __typename?: 'User', username: string, id: number, avatar: string }> | null } | null };

export type RetrieveInChannelQueryVariables = Exact<{
  limit: Scalars['Float'];
  offset: Scalars['Float'];
  channelId: Scalars['Float'];
}>;


export type RetrieveInChannelQuery = { __typename?: 'Query', retrieveInChannel?: { __typename?: 'MessagesResponse', hasMore?: boolean | null, errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, messages?: Array<{ __typename?: 'Message', id: number, msg: string, createdAt: string, senderId: number, channelId: number, type: string }> | null, users?: Array<{ __typename?: 'User', id: number, username: string, avatar: string }> | null } | null };

export type SearchGroupsQueryVariables = Exact<{
  name: Scalars['String'];
}>;


export type SearchGroupsQuery = { __typename?: 'Query', searchGroups: Array<{ __typename?: 'GroupWithChannel', channel: { __typename?: 'Channel', id: number, name: string }, group: { __typename?: 'Group', id: number, name: string } }> };

export type SearchUsersQueryVariables = Exact<{
  username: Scalars['String'];
}>;


export type SearchUsersQuery = { __typename?: 'Query', searchUsers: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, users?: Array<{ __typename?: 'User', id: number, username: string, avatar: string }> | null } };

export type GetWhitelistQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type GetWhitelistQuery = { __typename?: 'Query', getWhitelist: { __typename?: 'UsersResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null, users?: Array<{ __typename?: 'User', id: number, username: string, avatar: string }> | null } };

export type IsCurrentOnWhitelistQueryVariables = Exact<{
  channelId: Scalars['Float'];
}>;


export type IsCurrentOnWhitelistQuery = { __typename?: 'Query', isCurrentOnWhitelist: boolean };


export const AddFriendDocument = gql`
    mutation AddFriend($friendId: Float!) {
  addFriend(friendId: $friendId) {
    friendship {
      user1Id
      user2Id
    }
    errors {
      field
      message
    }
  }
}
    `;
export type AddFriendMutationFn = Apollo.MutationFunction<AddFriendMutation, AddFriendMutationVariables>;

/**
 * __useAddFriendMutation__
 *
 * To run a mutation, you first call `useAddFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFriendMutation, { data, loading, error }] = useAddFriendMutation({
 *   variables: {
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
export function useAddFriendMutation(baseOptions?: Apollo.MutationHookOptions<AddFriendMutation, AddFriendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFriendMutation, AddFriendMutationVariables>(AddFriendDocument, options);
      }
export type AddFriendMutationHookResult = ReturnType<typeof useAddFriendMutation>;
export type AddFriendMutationResult = Apollo.MutationResult<AddFriendMutation>;
export type AddFriendMutationOptions = Apollo.BaseMutationOptions<AddFriendMutation, AddFriendMutationVariables>;
export const RemoveFriendDocument = gql`
    mutation RemoveFriend($friendId: Float!) {
  removeFriend(friendId: $friendId) {
    friendship {
      user1Id
      user2Id
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RemoveFriendMutationFn = Apollo.MutationFunction<RemoveFriendMutation, RemoveFriendMutationVariables>;

/**
 * __useRemoveFriendMutation__
 *
 * To run a mutation, you first call `useRemoveFriendMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveFriendMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeFriendMutation, { data, loading, error }] = useRemoveFriendMutation({
 *   variables: {
 *      friendId: // value for 'friendId'
 *   },
 * });
 */
export function useRemoveFriendMutation(baseOptions?: Apollo.MutationHookOptions<RemoveFriendMutation, RemoveFriendMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveFriendMutation, RemoveFriendMutationVariables>(RemoveFriendDocument, options);
      }
export type RemoveFriendMutationHookResult = ReturnType<typeof useRemoveFriendMutation>;
export type RemoveFriendMutationResult = Apollo.MutationResult<RemoveFriendMutation>;
export type RemoveFriendMutationOptions = Apollo.BaseMutationOptions<RemoveFriendMutation, RemoveFriendMutationVariables>;
export const ChangePasswordTokenDocument = gql`
    mutation ChangePasswordToken($newPassword: String!, $token: String!) {
  changePasswordToken(newPassword: $newPassword, token: $token) {
    user {
      id
      username
      avatar
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangePasswordTokenMutationFn = Apollo.MutationFunction<ChangePasswordTokenMutation, ChangePasswordTokenMutationVariables>;

/**
 * __useChangePasswordTokenMutation__
 *
 * To run a mutation, you first call `useChangePasswordTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordTokenMutation, { data, loading, error }] = useChangePasswordTokenMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      token: // value for 'token'
 *   },
 * });
 */
export function useChangePasswordTokenMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordTokenMutation, ChangePasswordTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordTokenMutation, ChangePasswordTokenMutationVariables>(ChangePasswordTokenDocument, options);
      }
export type ChangePasswordTokenMutationHookResult = ReturnType<typeof useChangePasswordTokenMutation>;
export type ChangePasswordTokenMutationResult = Apollo.MutationResult<ChangePasswordTokenMutation>;
export type ChangePasswordTokenMutationOptions = Apollo.BaseMutationOptions<ChangePasswordTokenMutation, ChangePasswordTokenMutationVariables>;
export const ChangeUsernameDocument = gql`
    mutation ChangeUsername($newUsername: String!) {
  changeUsername(newUsername: $newUsername) {
    user {
      id
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangeUsernameMutationFn = Apollo.MutationFunction<ChangeUsernameMutation, ChangeUsernameMutationVariables>;

/**
 * __useChangeUsernameMutation__
 *
 * To run a mutation, you first call `useChangeUsernameMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeUsernameMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeUsernameMutation, { data, loading, error }] = useChangeUsernameMutation({
 *   variables: {
 *      newUsername: // value for 'newUsername'
 *   },
 * });
 */
export function useChangeUsernameMutation(baseOptions?: Apollo.MutationHookOptions<ChangeUsernameMutation, ChangeUsernameMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeUsernameMutation, ChangeUsernameMutationVariables>(ChangeUsernameDocument, options);
      }
export type ChangeUsernameMutationHookResult = ReturnType<typeof useChangeUsernameMutation>;
export type ChangeUsernameMutationResult = Apollo.MutationResult<ChangeUsernameMutation>;
export type ChangeUsernameMutationOptions = Apollo.BaseMutationOptions<ChangeUsernameMutation, ChangeUsernameMutationVariables>;
export const CreateChannelDocument = gql`
    mutation CreateChannel($groupId: Float!, $name: String!) {
  createChannel(groupId: $groupId, name: $name) {
    channel {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateChannelMutationFn = Apollo.MutationFunction<CreateChannelMutation, CreateChannelMutationVariables>;

/**
 * __useCreateChannelMutation__
 *
 * To run a mutation, you first call `useCreateChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createChannelMutation, { data, loading, error }] = useCreateChannelMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateChannelMutation(baseOptions?: Apollo.MutationHookOptions<CreateChannelMutation, CreateChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateChannelMutation, CreateChannelMutationVariables>(CreateChannelDocument, options);
      }
export type CreateChannelMutationHookResult = ReturnType<typeof useCreateChannelMutation>;
export type CreateChannelMutationResult = Apollo.MutationResult<CreateChannelMutation>;
export type CreateChannelMutationOptions = Apollo.BaseMutationOptions<CreateChannelMutation, CreateChannelMutationVariables>;
export const CreateGroupDocument = gql`
    mutation CreateGroup($name: String!) {
  createGroup(name: $name) {
    errors {
      field
      message
    }
    group {
      name
      createdAt
    }
    firstChannelId
  }
}
    `;
export type CreateGroupMutationFn = Apollo.MutationFunction<CreateGroupMutation, CreateGroupMutationVariables>;

/**
 * __useCreateGroupMutation__
 *
 * To run a mutation, you first call `useCreateGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGroupMutation, { data, loading, error }] = useCreateGroupMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useCreateGroupMutation(baseOptions?: Apollo.MutationHookOptions<CreateGroupMutation, CreateGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGroupMutation, CreateGroupMutationVariables>(CreateGroupDocument, options);
      }
export type CreateGroupMutationHookResult = ReturnType<typeof useCreateGroupMutation>;
export type CreateGroupMutationResult = Apollo.MutationResult<CreateGroupMutation>;
export type CreateGroupMutationOptions = Apollo.BaseMutationOptions<CreateGroupMutation, CreateGroupMutationVariables>;
export const DeleteChannelDocument = gql`
    mutation DeleteChannel($deleteChannelId: Float!) {
  deleteChannel(id: $deleteChannelId)
}
    `;
export type DeleteChannelMutationFn = Apollo.MutationFunction<DeleteChannelMutation, DeleteChannelMutationVariables>;

/**
 * __useDeleteChannelMutation__
 *
 * To run a mutation, you first call `useDeleteChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteChannelMutation, { data, loading, error }] = useDeleteChannelMutation({
 *   variables: {
 *      deleteChannelId: // value for 'deleteChannelId'
 *   },
 * });
 */
export function useDeleteChannelMutation(baseOptions?: Apollo.MutationHookOptions<DeleteChannelMutation, DeleteChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteChannelMutation, DeleteChannelMutationVariables>(DeleteChannelDocument, options);
      }
export type DeleteChannelMutationHookResult = ReturnType<typeof useDeleteChannelMutation>;
export type DeleteChannelMutationResult = Apollo.MutationResult<DeleteChannelMutation>;
export type DeleteChannelMutationOptions = Apollo.BaseMutationOptions<DeleteChannelMutation, DeleteChannelMutationVariables>;
export const DeleteGroupDocument = gql`
    mutation DeleteGroup($deleteGroupId: Float!) {
  deleteGroup(id: $deleteGroupId) {
    group {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
    `;
export type DeleteGroupMutationFn = Apollo.MutationFunction<DeleteGroupMutation, DeleteGroupMutationVariables>;

/**
 * __useDeleteGroupMutation__
 *
 * To run a mutation, you first call `useDeleteGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteGroupMutation, { data, loading, error }] = useDeleteGroupMutation({
 *   variables: {
 *      deleteGroupId: // value for 'deleteGroupId'
 *   },
 * });
 */
export function useDeleteGroupMutation(baseOptions?: Apollo.MutationHookOptions<DeleteGroupMutation, DeleteGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteGroupMutation, DeleteGroupMutationVariables>(DeleteGroupDocument, options);
      }
export type DeleteGroupMutationHookResult = ReturnType<typeof useDeleteGroupMutation>;
export type DeleteGroupMutationResult = Apollo.MutationResult<DeleteGroupMutation>;
export type DeleteGroupMutationOptions = Apollo.BaseMutationOptions<DeleteGroupMutation, DeleteGroupMutationVariables>;
export const ForgotPasswordDocument = gql`
    mutation ForgotPassword($email: String!) {
  forgotPassword(email: $email)
}
    `;
export type ForgotPasswordMutationFn = Apollo.MutationFunction<ForgotPasswordMutation, ForgotPasswordMutationVariables>;

/**
 * __useForgotPasswordMutation__
 *
 * To run a mutation, you first call `useForgotPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgotPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgotPasswordMutation, { data, loading, error }] = useForgotPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgotPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ForgotPasswordMutation, ForgotPasswordMutationVariables>(ForgotPasswordDocument, options);
      }
export type ForgotPasswordMutationHookResult = ReturnType<typeof useForgotPasswordMutation>;
export type ForgotPasswordMutationResult = Apollo.MutationResult<ForgotPasswordMutation>;
export type ForgotPasswordMutationOptions = Apollo.BaseMutationOptions<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const JoinGroupDocument = gql`
    mutation JoinGroup($groupId: Float!) {
  joinGroup(groupId: $groupId) {
    errors {
      field
      message
    }
    ghu {
      groupId
    }
  }
}
    `;
export type JoinGroupMutationFn = Apollo.MutationFunction<JoinGroupMutation, JoinGroupMutationVariables>;

/**
 * __useJoinGroupMutation__
 *
 * To run a mutation, you first call `useJoinGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGroupMutation, { data, loading, error }] = useJoinGroupMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useJoinGroupMutation(baseOptions?: Apollo.MutationHookOptions<JoinGroupMutation, JoinGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinGroupMutation, JoinGroupMutationVariables>(JoinGroupDocument, options);
      }
export type JoinGroupMutationHookResult = ReturnType<typeof useJoinGroupMutation>;
export type JoinGroupMutationResult = Apollo.MutationResult<JoinGroupMutation>;
export type JoinGroupMutationOptions = Apollo.BaseMutationOptions<JoinGroupMutation, JoinGroupMutationVariables>;
export const GenerateInviteDocument = gql`
    mutation generateInvite($groupId: Float!) {
  generateInvite(groupId: $groupId)
}
    `;
export type GenerateInviteMutationFn = Apollo.MutationFunction<GenerateInviteMutation, GenerateInviteMutationVariables>;

/**
 * __useGenerateInviteMutation__
 *
 * To run a mutation, you first call `useGenerateInviteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateInviteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateInviteMutation, { data, loading, error }] = useGenerateInviteMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGenerateInviteMutation(baseOptions?: Apollo.MutationHookOptions<GenerateInviteMutation, GenerateInviteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateInviteMutation, GenerateInviteMutationVariables>(GenerateInviteDocument, options);
      }
export type GenerateInviteMutationHookResult = ReturnType<typeof useGenerateInviteMutation>;
export type GenerateInviteMutationResult = Apollo.MutationResult<GenerateInviteMutation>;
export type GenerateInviteMutationOptions = Apollo.BaseMutationOptions<GenerateInviteMutation, GenerateInviteMutationVariables>;
export const JoinGroupWithTokenDocument = gql`
    mutation JoinGroupWithToken($token: String!) {
  joinGroupWithToken(token: $token) {
    errors {
      field
      message
    }
    ghu {
      userId
      groupId
      joinedAt
    }
    firstChannelId
  }
}
    `;
export type JoinGroupWithTokenMutationFn = Apollo.MutationFunction<JoinGroupWithTokenMutation, JoinGroupWithTokenMutationVariables>;

/**
 * __useJoinGroupWithTokenMutation__
 *
 * To run a mutation, you first call `useJoinGroupWithTokenMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinGroupWithTokenMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinGroupWithTokenMutation, { data, loading, error }] = useJoinGroupWithTokenMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useJoinGroupWithTokenMutation(baseOptions?: Apollo.MutationHookOptions<JoinGroupWithTokenMutation, JoinGroupWithTokenMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinGroupWithTokenMutation, JoinGroupWithTokenMutationVariables>(JoinGroupWithTokenDocument, options);
      }
export type JoinGroupWithTokenMutationHookResult = ReturnType<typeof useJoinGroupWithTokenMutation>;
export type JoinGroupWithTokenMutationResult = Apollo.MutationResult<JoinGroupWithTokenMutation>;
export type JoinGroupWithTokenMutationOptions = Apollo.BaseMutationOptions<JoinGroupWithTokenMutation, JoinGroupWithTokenMutationVariables>;
export const KickUserDocument = gql`
    mutation KickUser($userId: Float!, $groupId: Float!) {
  kickUser(userId: $userId, groupId: $groupId) {
    errors {
      field
      message
    }
    user {
      id
      username
    }
  }
}
    `;
export type KickUserMutationFn = Apollo.MutationFunction<KickUserMutation, KickUserMutationVariables>;

/**
 * __useKickUserMutation__
 *
 * To run a mutation, you first call `useKickUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useKickUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [kickUserMutation, { data, loading, error }] = useKickUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useKickUserMutation(baseOptions?: Apollo.MutationHookOptions<KickUserMutation, KickUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<KickUserMutation, KickUserMutationVariables>(KickUserDocument, options);
      }
export type KickUserMutationHookResult = ReturnType<typeof useKickUserMutation>;
export type KickUserMutationResult = Apollo.MutationResult<KickUserMutation>;
export type KickUserMutationOptions = Apollo.BaseMutationOptions<KickUserMutation, KickUserMutationVariables>;
export const LeaveGroupDocument = gql`
    mutation LeaveGroup($groupId: Float!) {
  leaveGroup(groupId: $groupId) {
    errors {
      field
      message
    }
    ghu {
      groupId
      userId
    }
  }
}
    `;
export type LeaveGroupMutationFn = Apollo.MutationFunction<LeaveGroupMutation, LeaveGroupMutationVariables>;

/**
 * __useLeaveGroupMutation__
 *
 * To run a mutation, you first call `useLeaveGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveGroupMutation, { data, loading, error }] = useLeaveGroupMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useLeaveGroupMutation(baseOptions?: Apollo.MutationHookOptions<LeaveGroupMutation, LeaveGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveGroupMutation, LeaveGroupMutationVariables>(LeaveGroupDocument, options);
      }
export type LeaveGroupMutationHookResult = ReturnType<typeof useLeaveGroupMutation>;
export type LeaveGroupMutationResult = Apollo.MutationResult<LeaveGroupMutation>;
export type LeaveGroupMutationOptions = Apollo.BaseMutationOptions<LeaveGroupMutation, LeaveGroupMutationVariables>;
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
export const RenameChannelDocument = gql`
    mutation RenameChannel($newName: String!, $channelId: Float!) {
  renameChannel(newName: $newName, channelId: $channelId) {
    channel {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RenameChannelMutationFn = Apollo.MutationFunction<RenameChannelMutation, RenameChannelMutationVariables>;

/**
 * __useRenameChannelMutation__
 *
 * To run a mutation, you first call `useRenameChannelMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameChannelMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameChannelMutation, { data, loading, error }] = useRenameChannelMutation({
 *   variables: {
 *      newName: // value for 'newName'
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useRenameChannelMutation(baseOptions?: Apollo.MutationHookOptions<RenameChannelMutation, RenameChannelMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameChannelMutation, RenameChannelMutationVariables>(RenameChannelDocument, options);
      }
export type RenameChannelMutationHookResult = ReturnType<typeof useRenameChannelMutation>;
export type RenameChannelMutationResult = Apollo.MutationResult<RenameChannelMutation>;
export type RenameChannelMutationOptions = Apollo.BaseMutationOptions<RenameChannelMutation, RenameChannelMutationVariables>;
export const RenameGroupDocument = gql`
    mutation RenameGroup($newName: String!, $renameGroupId: Float!) {
  renameGroup(newName: $newName, id: $renameGroupId) {
    group {
      id
      name
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RenameGroupMutationFn = Apollo.MutationFunction<RenameGroupMutation, RenameGroupMutationVariables>;

/**
 * __useRenameGroupMutation__
 *
 * To run a mutation, you first call `useRenameGroupMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameGroupMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameGroupMutation, { data, loading, error }] = useRenameGroupMutation({
 *   variables: {
 *      newName: // value for 'newName'
 *      renameGroupId: // value for 'renameGroupId'
 *   },
 * });
 */
export function useRenameGroupMutation(baseOptions?: Apollo.MutationHookOptions<RenameGroupMutation, RenameGroupMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameGroupMutation, RenameGroupMutationVariables>(RenameGroupDocument, options);
      }
export type RenameGroupMutationHookResult = ReturnType<typeof useRenameGroupMutation>;
export type RenameGroupMutationResult = Apollo.MutationResult<RenameGroupMutation>;
export type RenameGroupMutationOptions = Apollo.BaseMutationOptions<RenameGroupMutation, RenameGroupMutationVariables>;
export const SendDmDocument = gql`
    mutation SendDM($receiverId: Float!, $msg: String!, $type: String!) {
  sendDM(receiverId: $receiverId, msg: $msg, type: $type) {
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
 *      type: // value for 'type'
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
    mutation SendInChannel($channelId: Float!, $msg: String!, $type: String!) {
  sendInChannel(channelId: $channelId, msg: $msg, type: $type) {
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
 *      type: // value for 'type'
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
export const ChangeAvatarDocument = gql`
    mutation ChangeAvatar($filename: String!) {
  changeAvatar(filename: $filename) {
    user {
      id
      avatar
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangeAvatarMutationFn = Apollo.MutationFunction<ChangeAvatarMutation, ChangeAvatarMutationVariables>;

/**
 * __useChangeAvatarMutation__
 *
 * To run a mutation, you first call `useChangeAvatarMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeAvatarMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeAvatarMutation, { data, loading, error }] = useChangeAvatarMutation({
 *   variables: {
 *      filename: // value for 'filename'
 *   },
 * });
 */
export function useChangeAvatarMutation(baseOptions?: Apollo.MutationHookOptions<ChangeAvatarMutation, ChangeAvatarMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeAvatarMutation, ChangeAvatarMutationVariables>(ChangeAvatarDocument, options);
      }
export type ChangeAvatarMutationHookResult = ReturnType<typeof useChangeAvatarMutation>;
export type ChangeAvatarMutationResult = Apollo.MutationResult<ChangeAvatarMutation>;
export type ChangeAvatarMutationOptions = Apollo.BaseMutationOptions<ChangeAvatarMutation, ChangeAvatarMutationVariables>;
export const ChangeEmailDocument = gql`
    mutation ChangeEmail($newEmail: String!) {
  changeEmail(newEmail: $newEmail) {
    user {
      email
      id
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangeEmailMutationFn = Apollo.MutationFunction<ChangeEmailMutation, ChangeEmailMutationVariables>;

/**
 * __useChangeEmailMutation__
 *
 * To run a mutation, you first call `useChangeEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangeEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changeEmailMutation, { data, loading, error }] = useChangeEmailMutation({
 *   variables: {
 *      newEmail: // value for 'newEmail'
 *   },
 * });
 */
export function useChangeEmailMutation(baseOptions?: Apollo.MutationHookOptions<ChangeEmailMutation, ChangeEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangeEmailMutation, ChangeEmailMutationVariables>(ChangeEmailDocument, options);
      }
export type ChangeEmailMutationHookResult = ReturnType<typeof useChangeEmailMutation>;
export type ChangeEmailMutationResult = Apollo.MutationResult<ChangeEmailMutation>;
export type ChangeEmailMutationOptions = Apollo.BaseMutationOptions<ChangeEmailMutation, ChangeEmailMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($newPassword: String!, $oldPassword: String!) {
  changePassword(newPassword: $newPassword, oldPassword: $oldPassword) {
    user {
      id
      email
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      newPassword: // value for 'newPassword'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const ToggleVisibilityDocument = gql`
    mutation ToggleVisibility($channelId: Float!) {
  toggleVisibility(channelId: $channelId) {
    errors {
      field
      message
    }
    channel {
      id
      name
      groupId
      isPrivate
    }
  }
}
    `;
export type ToggleVisibilityMutationFn = Apollo.MutationFunction<ToggleVisibilityMutation, ToggleVisibilityMutationVariables>;

/**
 * __useToggleVisibilityMutation__
 *
 * To run a mutation, you first call `useToggleVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleVisibilityMutation, { data, loading, error }] = useToggleVisibilityMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useToggleVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<ToggleVisibilityMutation, ToggleVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleVisibilityMutation, ToggleVisibilityMutationVariables>(ToggleVisibilityDocument, options);
      }
export type ToggleVisibilityMutationHookResult = ReturnType<typeof useToggleVisibilityMutation>;
export type ToggleVisibilityMutationResult = Apollo.MutationResult<ToggleVisibilityMutation>;
export type ToggleVisibilityMutationOptions = Apollo.BaseMutationOptions<ToggleVisibilityMutation, ToggleVisibilityMutationVariables>;
export const ToggleGroupVisibilityDocument = gql`
    mutation ToggleGroupVisibility($groupId: Float!) {
  toggleGroupVisibility(groupId: $groupId) {
    errors {
      field
      message
    }
    group {
      id
      adminId
      name
      createdAt
      type
      isPrivate
    }
    firstChannelId
  }
}
    `;
export type ToggleGroupVisibilityMutationFn = Apollo.MutationFunction<ToggleGroupVisibilityMutation, ToggleGroupVisibilityMutationVariables>;

/**
 * __useToggleGroupVisibilityMutation__
 *
 * To run a mutation, you first call `useToggleGroupVisibilityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useToggleGroupVisibilityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [toggleGroupVisibilityMutation, { data, loading, error }] = useToggleGroupVisibilityMutation({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useToggleGroupVisibilityMutation(baseOptions?: Apollo.MutationHookOptions<ToggleGroupVisibilityMutation, ToggleGroupVisibilityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ToggleGroupVisibilityMutation, ToggleGroupVisibilityMutationVariables>(ToggleGroupVisibilityDocument, options);
      }
export type ToggleGroupVisibilityMutationHookResult = ReturnType<typeof useToggleGroupVisibilityMutation>;
export type ToggleGroupVisibilityMutationResult = Apollo.MutationResult<ToggleGroupVisibilityMutation>;
export type ToggleGroupVisibilityMutationOptions = Apollo.BaseMutationOptions<ToggleGroupVisibilityMutation, ToggleGroupVisibilityMutationVariables>;
export const VerifyEmailDocument = gql`
    mutation VerifyEmail($token: String!) {
  verifyEmail(token: $token) {
    user {
      id
      email
    }
    errors {
      field
      message
    }
  }
}
    `;
export type VerifyEmailMutationFn = Apollo.MutationFunction<VerifyEmailMutation, VerifyEmailMutationVariables>;

/**
 * __useVerifyEmailMutation__
 *
 * To run a mutation, you first call `useVerifyEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVerifyEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [verifyEmailMutation, { data, loading, error }] = useVerifyEmailMutation({
 *   variables: {
 *      token: // value for 'token'
 *   },
 * });
 */
export function useVerifyEmailMutation(baseOptions?: Apollo.MutationHookOptions<VerifyEmailMutation, VerifyEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<VerifyEmailMutation, VerifyEmailMutationVariables>(VerifyEmailDocument, options);
      }
export type VerifyEmailMutationHookResult = ReturnType<typeof useVerifyEmailMutation>;
export type VerifyEmailMutationResult = Apollo.MutationResult<VerifyEmailMutation>;
export type VerifyEmailMutationOptions = Apollo.BaseMutationOptions<VerifyEmailMutation, VerifyEmailMutationVariables>;
export const AddUserToWhitelistDocument = gql`
    mutation AddUserToWhitelist($channelId: Float!, $username: String!) {
  addUserToWhitelist(channelId: $channelId, username: $username) {
    errors {
      field
      message
    }
    whitelist {
      userId
      channelId
    }
  }
}
    `;
export type AddUserToWhitelistMutationFn = Apollo.MutationFunction<AddUserToWhitelistMutation, AddUserToWhitelistMutationVariables>;

/**
 * __useAddUserToWhitelistMutation__
 *
 * To run a mutation, you first call `useAddUserToWhitelistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserToWhitelistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserToWhitelistMutation, { data, loading, error }] = useAddUserToWhitelistMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useAddUserToWhitelistMutation(baseOptions?: Apollo.MutationHookOptions<AddUserToWhitelistMutation, AddUserToWhitelistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserToWhitelistMutation, AddUserToWhitelistMutationVariables>(AddUserToWhitelistDocument, options);
      }
export type AddUserToWhitelistMutationHookResult = ReturnType<typeof useAddUserToWhitelistMutation>;
export type AddUserToWhitelistMutationResult = Apollo.MutationResult<AddUserToWhitelistMutation>;
export type AddUserToWhitelistMutationOptions = Apollo.BaseMutationOptions<AddUserToWhitelistMutation, AddUserToWhitelistMutationVariables>;
export const RemoveUserFromWhitelistDocument = gql`
    mutation RemoveUserFromWhitelist($channelId: Float!, $username: String!) {
  removeUserFromWhitelist(channelId: $channelId, username: $username) {
    errors {
      field
      message
    }
    whitelist {
      userId
      channelId
    }
  }
}
    `;
export type RemoveUserFromWhitelistMutationFn = Apollo.MutationFunction<RemoveUserFromWhitelistMutation, RemoveUserFromWhitelistMutationVariables>;

/**
 * __useRemoveUserFromWhitelistMutation__
 *
 * To run a mutation, you first call `useRemoveUserFromWhitelistMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRemoveUserFromWhitelistMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [removeUserFromWhitelistMutation, { data, loading, error }] = useRemoveUserFromWhitelistMutation({
 *   variables: {
 *      channelId: // value for 'channelId'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useRemoveUserFromWhitelistMutation(baseOptions?: Apollo.MutationHookOptions<RemoveUserFromWhitelistMutation, RemoveUserFromWhitelistMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RemoveUserFromWhitelistMutation, RemoveUserFromWhitelistMutationVariables>(RemoveUserFromWhitelistDocument, options);
      }
export type RemoveUserFromWhitelistMutationHookResult = ReturnType<typeof useRemoveUserFromWhitelistMutation>;
export type RemoveUserFromWhitelistMutationResult = Apollo.MutationResult<RemoveUserFromWhitelistMutation>;
export type RemoveUserFromWhitelistMutationOptions = Apollo.BaseMutationOptions<RemoveUserFromWhitelistMutation, RemoveUserFromWhitelistMutationVariables>;
export const ChannelToGroupDocument = gql`
    query ChannelToGroup($channelId: Float!) {
  channelToGroup(channelId: $channelId) {
    group {
      id
      name
      adminId
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
export const DeleteMessageDocument = gql`
    mutation DeleteMessage($deleteMessageId: Float!) {
  deleteMessage(id: $deleteMessageId) {
    errors {
      field
      message
    }
    message {
      senderId
      channelId
      msg
      createdAt
      type
    }
  }
}
    `;
export type DeleteMessageMutationFn = Apollo.MutationFunction<DeleteMessageMutation, DeleteMessageMutationVariables>;

/**
 * __useDeleteMessageMutation__
 *
 * To run a mutation, you first call `useDeleteMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteMessageMutation, { data, loading, error }] = useDeleteMessageMutation({
 *   variables: {
 *      deleteMessageId: // value for 'deleteMessageId'
 *   },
 * });
 */
export function useDeleteMessageMutation(baseOptions?: Apollo.MutationHookOptions<DeleteMessageMutation, DeleteMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteMessageMutation, DeleteMessageMutationVariables>(DeleteMessageDocument, options);
      }
export type DeleteMessageMutationHookResult = ReturnType<typeof useDeleteMessageMutation>;
export type DeleteMessageMutationResult = Apollo.MutationResult<DeleteMessageMutation>;
export type DeleteMessageMutationOptions = Apollo.BaseMutationOptions<DeleteMessageMutation, DeleteMessageMutationVariables>;
export const GetChannelsInGroupDocument = gql`
    query GetChannelsInGroup($groupId: Float!) {
  getChannelsInGroup(groupId: $groupId) {
    channels {
      id
      groupId
      name
      isPrivate
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
export const GetChannelInfoDocument = gql`
    query GetChannelInfo($channelId: Float!) {
  getChannelInfo(channelId: $channelId) {
    channel {
      id
      name
      isPrivate
    }
    errors {
      field
      message
    }
  }
}
    `;

/**
 * __useGetChannelInfoQuery__
 *
 * To run a query within a React component, call `useGetChannelInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetChannelInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetChannelInfoQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetChannelInfoQuery(baseOptions: Apollo.QueryHookOptions<GetChannelInfoQuery, GetChannelInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetChannelInfoQuery, GetChannelInfoQueryVariables>(GetChannelInfoDocument, options);
      }
export function useGetChannelInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetChannelInfoQuery, GetChannelInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetChannelInfoQuery, GetChannelInfoQueryVariables>(GetChannelInfoDocument, options);
        }
export type GetChannelInfoQueryHookResult = ReturnType<typeof useGetChannelInfoQuery>;
export type GetChannelInfoLazyQueryHookResult = ReturnType<typeof useGetChannelInfoLazyQuery>;
export type GetChannelInfoQueryResult = Apollo.QueryResult<GetChannelInfoQuery, GetChannelInfoQueryVariables>;
export const GetFriendsDocument = gql`
    query GetFriends($userId: Float!) {
  getFriends(userId: $userId) {
    username
    id
    avatar
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
export const GetFriendsCurrentDocument = gql`
    query GetFriendsCurrent {
  getFriendsCurrent {
    errors {
      field
      message
    }
    users {
      id
    }
  }
}
    `;

/**
 * __useGetFriendsCurrentQuery__
 *
 * To run a query within a React component, call `useGetFriendsCurrentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFriendsCurrentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFriendsCurrentQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetFriendsCurrentQuery(baseOptions?: Apollo.QueryHookOptions<GetFriendsCurrentQuery, GetFriendsCurrentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFriendsCurrentQuery, GetFriendsCurrentQueryVariables>(GetFriendsCurrentDocument, options);
      }
export function useGetFriendsCurrentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFriendsCurrentQuery, GetFriendsCurrentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFriendsCurrentQuery, GetFriendsCurrentQueryVariables>(GetFriendsCurrentDocument, options);
        }
export type GetFriendsCurrentQueryHookResult = ReturnType<typeof useGetFriendsCurrentQuery>;
export type GetFriendsCurrentLazyQueryHookResult = ReturnType<typeof useGetFriendsCurrentLazyQuery>;
export type GetFriendsCurrentQueryResult = Apollo.QueryResult<GetFriendsCurrentQuery, GetFriendsCurrentQueryVariables>;
export const GetGroupInfoDocument = gql`
    query GetGroupInfo($groupId: Float!) {
  getGroupInfo(groupId: $groupId) {
    group {
      id
      name
      adminId
      isPrivate
    }
    errors {
      field
      message
    }
  }
}
    `;

/**
 * __useGetGroupInfoQuery__
 *
 * To run a query within a React component, call `useGetGroupInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGroupInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGroupInfoQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetGroupInfoQuery(baseOptions: Apollo.QueryHookOptions<GetGroupInfoQuery, GetGroupInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGroupInfoQuery, GetGroupInfoQueryVariables>(GetGroupInfoDocument, options);
      }
export function useGetGroupInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGroupInfoQuery, GetGroupInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGroupInfoQuery, GetGroupInfoQueryVariables>(GetGroupInfoDocument, options);
        }
export type GetGroupInfoQueryHookResult = ReturnType<typeof useGetGroupInfoQuery>;
export type GetGroupInfoLazyQueryHookResult = ReturnType<typeof useGetGroupInfoLazyQuery>;
export type GetGroupInfoQueryResult = Apollo.QueryResult<GetGroupInfoQuery, GetGroupInfoQueryVariables>;
export const GetGroupUsersDocument = gql`
    query GetGroupUsers($groupId: Float!) {
  getGroupUsers(groupId: $groupId) {
    users {
      id
      username
      avatar
    }
    errors {
      field
      message
    }
  }
}
    `;

/**
 * __useGetGroupUsersQuery__
 *
 * To run a query within a React component, call `useGetGroupUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGroupUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGroupUsersQuery({
 *   variables: {
 *      groupId: // value for 'groupId'
 *   },
 * });
 */
export function useGetGroupUsersQuery(baseOptions: Apollo.QueryHookOptions<GetGroupUsersQuery, GetGroupUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGroupUsersQuery, GetGroupUsersQueryVariables>(GetGroupUsersDocument, options);
      }
export function useGetGroupUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGroupUsersQuery, GetGroupUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGroupUsersQuery, GetGroupUsersQueryVariables>(GetGroupUsersDocument, options);
        }
export type GetGroupUsersQueryHookResult = ReturnType<typeof useGetGroupUsersQuery>;
export type GetGroupUsersLazyQueryHookResult = ReturnType<typeof useGetGroupUsersLazyQuery>;
export type GetGroupUsersQueryResult = Apollo.QueryResult<GetGroupUsersQuery, GetGroupUsersQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($id: Float!) {
  getUser(id: $id) {
    user {
      id
      username
      avatar
    }
    errors {
      field
      message
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
export const GetUserGroupsDocument = gql`
    query GetUserGroups($userId: Float!) {
  getUserGroups(userId: $userId) {
    errors {
      field
      message
    }
    groups {
      id
      name
      createdAt
    }
  }
}
    `;

/**
 * __useGetUserGroupsQuery__
 *
 * To run a query within a React component, call `useGetUserGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserGroupsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserGroupsQuery(baseOptions: Apollo.QueryHookOptions<GetUserGroupsQuery, GetUserGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserGroupsQuery, GetUserGroupsQueryVariables>(GetUserGroupsDocument, options);
      }
export function useGetUserGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserGroupsQuery, GetUserGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserGroupsQuery, GetUserGroupsQueryVariables>(GetUserGroupsDocument, options);
        }
export type GetUserGroupsQueryHookResult = ReturnType<typeof useGetUserGroupsQuery>;
export type GetUserGroupsLazyQueryHookResult = ReturnType<typeof useGetUserGroupsLazyQuery>;
export type GetUserGroupsQueryResult = Apollo.QueryResult<GetUserGroupsQuery, GetUserGroupsQueryVariables>;
export const GetUserGroupsCurrentDocument = gql`
    query GetUserGroupsCurrent {
  getUserGroupsCurrent {
    errors {
      field
      message
    }
    groups {
      id
      name
    }
    firstChannelIds
  }
}
    `;

/**
 * __useGetUserGroupsCurrentQuery__
 *
 * To run a query within a React component, call `useGetUserGroupsCurrentQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserGroupsCurrentQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserGroupsCurrentQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserGroupsCurrentQuery(baseOptions?: Apollo.QueryHookOptions<GetUserGroupsCurrentQuery, GetUserGroupsCurrentQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserGroupsCurrentQuery, GetUserGroupsCurrentQueryVariables>(GetUserGroupsCurrentDocument, options);
      }
export function useGetUserGroupsCurrentLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserGroupsCurrentQuery, GetUserGroupsCurrentQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserGroupsCurrentQuery, GetUserGroupsCurrentQueryVariables>(GetUserGroupsCurrentDocument, options);
        }
export type GetUserGroupsCurrentQueryHookResult = ReturnType<typeof useGetUserGroupsCurrentQuery>;
export type GetUserGroupsCurrentLazyQueryHookResult = ReturnType<typeof useGetUserGroupsCurrentLazyQuery>;
export type GetUserGroupsCurrentQueryResult = Apollo.QueryResult<GetUserGroupsCurrentQuery, GetUserGroupsCurrentQueryVariables>;
export const IsCurrentInChannelDocument = gql`
    query isCurrentInChannel($channelId: Float!) {
  isCurrentInChannel(channelId: $channelId)
}
    `;

/**
 * __useIsCurrentInChannelQuery__
 *
 * To run a query within a React component, call `useIsCurrentInChannelQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsCurrentInChannelQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsCurrentInChannelQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useIsCurrentInChannelQuery(baseOptions: Apollo.QueryHookOptions<IsCurrentInChannelQuery, IsCurrentInChannelQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsCurrentInChannelQuery, IsCurrentInChannelQueryVariables>(IsCurrentInChannelDocument, options);
      }
export function useIsCurrentInChannelLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsCurrentInChannelQuery, IsCurrentInChannelQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsCurrentInChannelQuery, IsCurrentInChannelQueryVariables>(IsCurrentInChannelDocument, options);
        }
export type IsCurrentInChannelQueryHookResult = ReturnType<typeof useIsCurrentInChannelQuery>;
export type IsCurrentInChannelLazyQueryHookResult = ReturnType<typeof useIsCurrentInChannelLazyQuery>;
export type IsCurrentInChannelQueryResult = Apollo.QueryResult<IsCurrentInChannelQuery, IsCurrentInChannelQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    username
    email
    avatar
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
      id
      msg
      senderId
      channelId
      createdAt
      type
    }
    errors {
      field
      message
    }
    users {
      username
      id
      avatar
    }
    hasMore
    newAmount
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
      id
      msg
      createdAt
      senderId
      channelId
      type
    }
    users {
      id
      username
      avatar
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
export const SearchGroupsDocument = gql`
    query SearchGroups($name: String!) {
  searchGroups(name: $name) {
    channel {
      id
      name
    }
    group {
      id
      name
    }
  }
}
    `;

/**
 * __useSearchGroupsQuery__
 *
 * To run a query within a React component, call `useSearchGroupsQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchGroupsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchGroupsQuery({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useSearchGroupsQuery(baseOptions: Apollo.QueryHookOptions<SearchGroupsQuery, SearchGroupsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchGroupsQuery, SearchGroupsQueryVariables>(SearchGroupsDocument, options);
      }
export function useSearchGroupsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchGroupsQuery, SearchGroupsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchGroupsQuery, SearchGroupsQueryVariables>(SearchGroupsDocument, options);
        }
export type SearchGroupsQueryHookResult = ReturnType<typeof useSearchGroupsQuery>;
export type SearchGroupsLazyQueryHookResult = ReturnType<typeof useSearchGroupsLazyQuery>;
export type SearchGroupsQueryResult = Apollo.QueryResult<SearchGroupsQuery, SearchGroupsQueryVariables>;
export const SearchUsersDocument = gql`
    query SearchUsers($username: String!) {
  searchUsers(username: $username) {
    errors {
      field
      message
    }
    users {
      id
      username
      avatar
    }
  }
}
    `;

/**
 * __useSearchUsersQuery__
 *
 * To run a query within a React component, call `useSearchUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersQuery({
 *   variables: {
 *      username: // value for 'username'
 *   },
 * });
 */
export function useSearchUsersQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
      }
export function useSearchUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersQuery, SearchUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersQuery, SearchUsersQueryVariables>(SearchUsersDocument, options);
        }
export type SearchUsersQueryHookResult = ReturnType<typeof useSearchUsersQuery>;
export type SearchUsersLazyQueryHookResult = ReturnType<typeof useSearchUsersLazyQuery>;
export type SearchUsersQueryResult = Apollo.QueryResult<SearchUsersQuery, SearchUsersQueryVariables>;
export const GetWhitelistDocument = gql`
    query GetWhitelist($channelId: Float!) {
  getWhitelist(channelId: $channelId) {
    errors {
      field
      message
    }
    users {
      id
      username
      avatar
    }
  }
}
    `;

/**
 * __useGetWhitelistQuery__
 *
 * To run a query within a React component, call `useGetWhitelistQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWhitelistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWhitelistQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useGetWhitelistQuery(baseOptions: Apollo.QueryHookOptions<GetWhitelistQuery, GetWhitelistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetWhitelistQuery, GetWhitelistQueryVariables>(GetWhitelistDocument, options);
      }
export function useGetWhitelistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetWhitelistQuery, GetWhitelistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetWhitelistQuery, GetWhitelistQueryVariables>(GetWhitelistDocument, options);
        }
export type GetWhitelistQueryHookResult = ReturnType<typeof useGetWhitelistQuery>;
export type GetWhitelistLazyQueryHookResult = ReturnType<typeof useGetWhitelistLazyQuery>;
export type GetWhitelistQueryResult = Apollo.QueryResult<GetWhitelistQuery, GetWhitelistQueryVariables>;
export const IsCurrentOnWhitelistDocument = gql`
    query isCurrentOnWhitelist($channelId: Float!) {
  isCurrentOnWhitelist(channelId: $channelId)
}
    `;

/**
 * __useIsCurrentOnWhitelistQuery__
 *
 * To run a query within a React component, call `useIsCurrentOnWhitelistQuery` and pass it any options that fit your needs.
 * When your component renders, `useIsCurrentOnWhitelistQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useIsCurrentOnWhitelistQuery({
 *   variables: {
 *      channelId: // value for 'channelId'
 *   },
 * });
 */
export function useIsCurrentOnWhitelistQuery(baseOptions: Apollo.QueryHookOptions<IsCurrentOnWhitelistQuery, IsCurrentOnWhitelistQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<IsCurrentOnWhitelistQuery, IsCurrentOnWhitelistQueryVariables>(IsCurrentOnWhitelistDocument, options);
      }
export function useIsCurrentOnWhitelistLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<IsCurrentOnWhitelistQuery, IsCurrentOnWhitelistQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<IsCurrentOnWhitelistQuery, IsCurrentOnWhitelistQueryVariables>(IsCurrentOnWhitelistDocument, options);
        }
export type IsCurrentOnWhitelistQueryHookResult = ReturnType<typeof useIsCurrentOnWhitelistQuery>;
export type IsCurrentOnWhitelistLazyQueryHookResult = ReturnType<typeof useIsCurrentOnWhitelistLazyQuery>;
export type IsCurrentOnWhitelistQueryResult = Apollo.QueryResult<IsCurrentOnWhitelistQuery, IsCurrentOnWhitelistQueryVariables>;