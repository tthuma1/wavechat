import type { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import {
  useGetGroupInfoQuery,
  useGetGroupUsersQuery,
  useMeQuery,
  useKickUserMutation,
} from "../generated/graphql";
import { socket } from "../utils/socket";
import { useEffect } from "react";

const UsersList: NextPage<{ groupId: number | undefined }> = props => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const {
    data: usersData,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useGetGroupUsersQuery({
    variables: { groupId: props.groupId as number },
  });

  const { data: groupData, loading: groupLoading } = useGetGroupInfoQuery({
    variables: { groupId: props.groupId as number },
  });

  const [kickUser] = useKickUserMutation();

  let users: any = [];

  const handleKick = async (userId: number) => {
    const response = await kickUser({
      variables: { groupId: props.groupId as number, userId },
    });

    if (response.data?.kickUser.user) {
      socket.emit("user kicked");
    }
  };

  useEffect(() => {
    socket.on("user kicked", () => {
      refetchUsers();
    });

    socket.on("group joined", () => {
      refetchUsers();
    });
  }, []);

  if (
    !meLoading &&
    meData?.me &&
    !usersLoading &&
    usersData?.getGroupUsers &&
    !groupLoading &&
    groupData?.getGroupInfo.group
  ) {
    for (const user of usersData.getGroupUsers.users!) {
      users.push(
        <div
          key={user.id}
          className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md w-72"
        >
          <img
            src={
              "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
              user.avatar
            }
            className="w-8 h-8 inline rounded-full mr-4"
          />
          <span className="overflow-hidden text-ellipsis">{user.username}</span>

          {user.id != meData.me.id && (
            <div className="flex-1 flex justify-end">
              <Link href={`/dm/${user.id}`}>
                <button className="w-10 border-2 border-blue-700 py-2 px-3 ml-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:text-gray-300 flex justify-center items-center">
                  <i className="fa-solid fa-message text-gray-800 dark:text-gray-300"></i>
                </button>
              </Link>
              {meData?.me?.id == groupData?.getGroupInfo.group.adminId && (
                <div className="dropdown">
                  <button className="drop-btn w-10 border-2 border-blue-700 py-2 px-3 ml-4 text-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:text-gray-300 flex justify-center items-center">
                    <i className="fa-solid fa-cog text-gray-800 dark:text-gray-300"></i>
                  </button>
                  <div className="dropdown-content hidden absolute">
                    <button
                      className="-ml-10 w-28 overflow-hidden text-ellipsis whitespace-nowrap bg-gray-100 dark:bg-gray-900 text-red-500 font-medium text-sm border-gray-300 dark:border-gray-700 border-2 px-2 py-1 rounded-sm hover:bg-gray-200 dark:hover:bg-gray-800"
                      onClick={() => handleKick(user.id)}
                    >
                      Kick {user.username}
                    </button>
                  </div>
                </div>
              )}
              {/* <button className="btn-secondary w-10 text-sm ml-2">
                <i className="fa-solid fa-circle-plus text-gray-300"></i>
              </button> */}
            </div>
          )}
        </div>
      );
    }
  }

  return (
    <div>
      <div className="mb-2">Members:</div>
      <div className="w-72 grid gap-2 grid-cols-1 flex-1 h-fit">{users}</div>
    </div>
  );
};

export default UsersList;
