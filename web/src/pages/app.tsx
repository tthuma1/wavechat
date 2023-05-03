import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import CreateGroupModal from "../components/CreateGroupModal";
import FriendList from "../components/FriendList";
import {
  useLogoutMutation,
  useMeQuery,
  useGetUserGroupsCurrentQuery,
  useGetFriendsCurrentQuery,
} from "../generated/graphql";
import Head from "next/head";
import { useEffect } from "react";

const App: NextPage = () => {
  const router = useRouter();
  const { data, loading, refetch, client } = useMeQuery();

  const { data: friendsData, loading: friendsLoading } =
    useGetFriendsCurrentQuery();
  const { data: groupsData, loading: groupsLoading } =
    useGetUserGroupsCurrentQuery();

  const [logout] = useLogoutMutation();

  refetch();

  if (!loading && !data?.me) router.push("/login");

  const handleLogout = async () => {
    const response = await logout();

    if (response.data?.logout) {
      client.resetStore();
      // router.push("/login");
    }
  };

  if (
    !loading &&
    !friendsLoading &&
    !groupsLoading &&
    friendsData &&
    groupsData
  )
    return (
      <>
        <Head>
          <title>WaveChat</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <CreateGroupModal />
        <div className="pt-10 flex flex-col items-center">
          <div className="flex w-[80vw]">
            <div className="flex-1"></div>
            <div className="mb-6">
              <p className="text-2xl text-center">Start chatting!</p>
              {(!friendsData.getFriendsCurrent.users ||
                friendsData.getFriendsCurrent.users.length == 0) &&
                (!groupsData.getUserGroupsCurrent.groups ||
                  groupsData.getUserGroupsCurrent.groups.length == 0) && (
                  <p className="mt-2">Start with adding some friends</p>
                )}
            </div>
            <div className="flex-1 flex justify-end">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md flex justify-center items-center text-gray-800 dark:text-gray-300 text-center hover:bg-gray-300 dark:hover:bg-gray-700 hover:cursor-pointer">
                <Link href="/settings">
                  <i className="fa-solid fa-gear p-4 text-lg"></i>
                </Link>
              </div>
              <div className="ml-3 h-10 w-10 bg-gray-200 dark:bg-gray-800 rounded-md flex justify-center items-center text-gray-800 dark:text-gray-300 text-center hover:bg-gray-300 dark:hover:bg-gray-700 hover:cursor-pointer">
                <button onClick={handleLogout}>
                  <i className="fa-solid fa-person-walking-arrow-right p-4 text-lg"></i>
                </button>
              </div>
            </div>
          </div>

          <FriendList type={1} />
        </div>
      </>
    );
  else return <div>Loading...</div>;
};

export default App;
