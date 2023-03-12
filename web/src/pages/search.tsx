import { ErrorMessage, Field, Form, Formik, useField } from "formik";
import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useState } from "react";
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

const Search: NextPage = () => {
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

  const handleAddFriend = async (id: number) => {
    const response = await addFriend({ variables: { friendId: id } });

    if (response.data?.addFriend) {
      setAddedFriends([...addedFriends, id]);
      // addedFriends.push(id);
    }

    // console.log(response.data);
  };

  const handleJoinGroup = async (id: number) => {
    const response = await joinGroup({ variables: { groupId: id } });

    if (response.data?.joinGroup) {
      setJoinedGroups([...joinedGroups, id]);
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
          <title>{}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="pt-20 flex flex-col items-center">
          <h2 className="text-4xl font-semibold mb-10">Search</h2>
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

                resetForm();
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form
                onSubmit={handleSubmit}
                className="bg-gray-850 rounded-md w-[70vw] px-14 py-10"
              >
                <label htmlFor="username">Username or group name:</label>
                <br />
                <Field
                  type="text"
                  name="name"
                  placeholder="username or group name"
                  className="mt-4 input-settings w-[30rem] mr-3"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-700 py-2 px-4 rounded-md font-semibold text-sm hover:bg-blue-500 disabled:text-gray-300"
                >
                  Search
                </button>
              </Form>
            )}
          </Formik>
          <div className="mt-3 bg-gray-850 rounded-md w-[70vw] px-14 py-5 grid grid-cols-2">
            <div className="border-r pr-4 border-gray-700">
              <p className="font-semibold">Users:</p>
              {users?.map(user => (
                <div key={user.id} className="flex my-3 items-center">
                  <img
                    src={
                      "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                      user.avatar
                    }
                    className="w-8 h-8 rounded-full mr-4"
                  />
                  <span
                    className="w-40 overflow-hidden text-ellipsis"
                    title={user.username}
                  >
                    {user.username}
                  </span>
                  {addedFriends.includes(user.id) ||
                  addedFriendsStart.includes(user.id) ? (
                    <Link href={`dm/${user.id}`}>
                      <button className="w-32 border-2 border-blue-700 bg-blue-700 py-2 px-3 ml-4 rounded-md text-sm hover:bg-blue-500 disabled:text-gray-300">
                        <i className="fa-solid fa-message text-gray-300 mr-2"></i>
                        Message
                      </button>
                    </Link>
                  ) : (
                    <button
                      // className="w-32 bg-violet-700 py-2 ml-4 rounded-md text-sm hover:bg-violet-500 disabled:text-gray-300"
                      className="w-32 border-violet-700 border-2 py-2 px-3 ml-4 rounded-md text-sm hover:bg-gray-700 disabled:text-gray-300"
                      onClick={() => handleAddFriend(user.id)}
                    >
                      <i className="fa-solid fa-circle-plus text-gray-300 mr-2"></i>
                      Add Friend
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="pl-4">
              <p className="font-semibold">Groups:</p>
              {groups?.map(g_w_c => (
                <div key={g_w_c.group.id} className="flex my-3 items-center">
                  {/* <img
                src={
                  "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                  user.avatar
                }
                className="w-8 h-8 rounded-full mr-4"
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
                        className="w-32 border-2 border-blue-700 bg-blue-700 py-2 px-3 ml-4 rounded-md text-sm hover:bg-blue-500 disabled:text-gray-300"
                        onClick={() => handleJoinGroup(g_w_c.group.id)}
                      >
                        {/* <i className="fa-solid fa-circle-plus text-gray-300 mr-2"></i> */}
                        Open Group
                      </button>
                    </Link>
                  ) : (
                    <button
                      className="w-32 border-violet-700 border-2 py-2 px-3 ml-4 rounded-md text-sm hover:bg-gray-700 disabled:text-gray-300"
                      onClick={() => handleJoinGroup(g_w_c.group.id)}
                    >
                      {/* <i className="fa-solid fa-circle-plus text-gray-300 mr-2"></i> */}
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