import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useSearchUsersQuery,
  useSearchGroupsQuery,
  useAddFriendMutation,
  useGetFriendsQuery,
  useMeQuery,
  useGetFriendsCurrentQuery,
  useGetUserGroupsCurrentQuery,
  GroupWithChannel,
  useJoinGroupMutation,
} from "../generated/graphql";
import { useRouter } from "next/router";
import { socket } from "../utils/socket";

const Search: NextPage = () => {
  const router = useRouter();
  const { refetch: usersRefetch } = useSearchUsersQuery({
    variables: { username: "" },
  });

  const { refetch: groupsRefetch } = useSearchGroupsQuery({
    variables: { name: "" },
  });

  const { data: meData, loading: meLoading } = useMeQuery();

  const { data: friendsData, loading: friendsLoading } =
    useGetFriendsCurrentQuery();

  const { data: groupsData, loading: groupsLoading } =
    useGetUserGroupsCurrentQuery();

  const [addFriend] = useAddFriendMutation();
  const [joinGroup] = useJoinGroupMutation();

  const [users, setUsers] = useState<any[]>();
  const [groups, setGroups] = useState<any[]>([]);
  const [addedFriends, setAddedFriends] = useState<number[]>([]);
  let addedFriendsStart: any[] = [];

  const [joinedGroups, setJoinedGroups] = useState<number[]>([]);
  let joinedGroupsStart: any[] = [];

  useEffect(() => {
    if (!meLoading && meData?.me == null) {
      router.push("/login");
    }
  });

  const handleAddFriend = async (id: number) => {
    const response = await addFriend({ variables: { friendId: id } });

    if (response.data?.addFriend) {
      setAddedFriends([...addedFriends, id]);
      // addedFriends.push(id);
      socket.emit("friend added");
    }

    // console.log(response.data);
  };

  const handleJoinGroup = async (id: number) => {
    const response = await joinGroup({ variables: { groupId: id } });

    if (response.data?.joinGroup) {
      setJoinedGroups([...joinedGroups, id]);
      socket.emit("group joined");
    }
  };

  if (!friendsLoading && friendsData?.getFriendsCurrent.users) {
    for (const user of friendsData.getFriendsCurrent.users) {
      addedFriendsStart.push(user.id);
    }
  }

  if (!groupsLoading && groupsData?.getUserGroupsCurrent.groups) {
    for (const group of groupsData.getUserGroupsCurrent.groups) {
      joinedGroupsStart.push(group.id);
    }
  }

  if (
    !friendsLoading &&
    !friendsData?.getFriendsCurrent.errors &&
    !groupsLoading &&
    !groupsData?.getUserGroupsCurrent.errors
  ) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>WaveChat - Settings</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center pt-20">
          <div className="flex w-full">
            <div className="flex justify-start flex-1">
              <div className="flex items-center justify-center w-10 h-10 text-center text-gray-800 rounded-md bg-gray-150 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">
                <Link href="/app">
                  <a>
                    <i className="p-4 text-lg fa-solid fa-arrow-left"></i>
                  </a>
                </Link>
              </div>
            </div>
            <h2 className="mb-10 text-4xl font-semibold">Search</h2>
            <div className="flex-1"></div>
          </div>
          <Formik
            initialValues={{
              name: "",
            }}
            onSubmit={async (values, { resetForm }) => {
              if (values.name) {
                const { data: usersData } = await usersRefetch({
                  username: values.name,
                });

                const { data: groupsData } = await groupsRefetch({
                  name: values.name,
                });

                if (usersData.searchUsers.users) {
                  setUsers(usersData.searchUsers.users);
                }

                if (groupsData) {
                  // let tmpGroups: any[] = [];
                  // let tmpChannels: any[] = [];
                  // for (const g_w_c of groupsData.searchGroups) {
                  //   tmpGroups.push(g_w_c.group);
                  //   tmpChannels.push(g_w_c.channel.id);
                  // }

                  // setChannels(tmpChannels);
                  // setGroups(tmpGroups);
                  setGroups(groupsData.searchGroups);
                }
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form
                onSubmit={handleSubmit}
                className="bg-gray-150 dark:bg-gray-850 rounded-md w-[70vw] px-14 py-10"
              >
                <label htmlFor="username">Username or group name:</label>
                <br />
                <Field
                  type="text"
                  name="name"
                  placeholder="username or group name"
                  className="mt-4 input-settings-light dark:input-settings w-[30rem] mr-3"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-gray-100 bg-blue-700 rounded-md hover:bg-blue-500 disabled:text-gray-300"
                >
                  Search
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-3 bg-gray-150 dark:bg-gray-850 rounded-md w-[70vw] h-[50vh] px-14 py-5 grid grid-cols-2 overflow-y-scroll scrollbar-colored">
            <div className="pr-4 border-r border-gray-700">
              <p className="font-semibold">Users:</p>
              {users?.map(user => (
                <div key={user.id} className="flex items-center my-3">
                  <img
                    src={
                      "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                      user.avatar
                    }
                    className="w-8 h-8 mr-4 rounded-full"
                  />
                  <span
                    className="w-40 overflow-hidden text-ellipsis"
                    title={user.username}
                  >
                    {user.username}
                  </span>
                  <div>
                    <Link href={`dm/${user.id}`}>
                      <button className="w-32 px-3 py-2 ml-4 text-sm text-gray-100 bg-blue-700 border-2 border-blue-700 rounded-md hover:bg-blue-500 disabled:text-gray-300">
                        {/* <button className="w-32 text-sm btn-secondary"> */}
                        <i className="mr-2 text-gray-300 fa-solid fa-message"></i>
                        Message
                      </button>
                    </Link>
                  </div>
                  {addedFriends.includes(user.id) ||
                  addedFriendsStart.includes(user.id) ? (
                    // <Link href={`dm/${user.id}`}>
                    //   <button className="w-32 px-3 py-2 ml-4 text-sm bg-blue-700 border-2 border-blue-700 rounded-md hover:bg-blue-500 disabled:text-gray-300">
                    //     <i className="mr-2 text-gray-300 fa-solid fa-message"></i>
                    //     Message
                    //   </button>
                    // </Link>
                    <div className="w-12 ml-4"></div>
                  ) : (
                    <button
                      // className="w-32 px-3 py-2 ml-4 text-sm border-2 rounded-md border-violet-700 hover:bg-gray-700 disabled:text-gray-300"
                      className="w-10 ml-4 text-sm btn-secondary"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      <i className="mr-2 text-gray-800 fa-solid fa-circle-plus dark:text-gray-300"></i>
                      {/* Add Friend */}
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="pl-4">
              <p className="font-semibold">Groups:</p>
              {groups?.map(g_w_c => (
                <div key={g_w_c.group.id} className="flex items-center my-3">
                  {/* <img
                src={
                  "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                  user.avatar
                }
                className="w-8 h-8 mr-4 rounded-full"
              /> */}
                  <span
                    className="w-40 overflow-hidden text-ellipsis"
                    title={g_w_c.group.name}
                  >
                    {g_w_c.group.name}
                  </span>
                  {joinedGroups.includes(g_w_c.group.id) ||
                  joinedGroupsStart.includes(g_w_c.group.id) ? (
                    <Link href={`channel/${g_w_c.channel.id}`}>
                      <button
                        className="w-32 px-3 py-2 ml-4 text-sm text-gray-100 bg-blue-700 border-2 border-blue-700 rounded-md hover:bg-blue-500 disabled:text-gray-300"
                        // className="w-32 ml-4 text-sm btn-secondary"
                        onClick={() => handleJoinGroup(g_w_c.group.id)}
                      >
                        {/* <i className="mr-2 text-gray-300 fa-solid fa-circle-plus"></i> */}
                        Open Group
                      </button>
                    </Link>
                  ) : (
                    <button
                      // className="w-32 px-3 py-2 ml-4 text-sm border-2 rounded-md border-violet-700 hover:bg-gray-700 disabled:text-gray-300"
                      className="w-32 ml-4 text-sm btn-secondary"
                      onClick={() => handleJoinGroup(g_w_c.group.id)}
                    >
                      {/* <i className="mr-2 text-gray-300 fa-solid fa-circle-plus"></i> */}
                      Join Group
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Search;
