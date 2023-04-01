import type { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import { useGetGroupUsersQuery, useMeQuery } from "../generated/graphql";

const UsersList: NextPage<{ groupId: number | undefined }> = props => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: usersData, loading: usersLoading } = useGetGroupUsersQuery({
    variables: { groupId: props.groupId as number },
  });

  let users: any = [];

  if (!meLoading && meData?.me) {
    if (!usersLoading && usersData?.getGroupUsers) {
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
            <span className="overflow-hidden text-ellipsis">
              {user.username}
            </span>

            {user.id != meData.me.id && (
              <div className="flex-1 flex justify-end">
                <Link href={`/dm/${user.id}`}>
                  <button className="w-10 border-2 border-blue-700 py-2 px-3 ml-4 rounded-md text-sm hover:bg-gray-300 dark:hover:bg-gray-600 disabled:text-gray-300">
                    <i className="fa-solid fa-message text-gray-800 dark:text-gray-300"></i>
                  </button>
                </Link>
                {/* <button className="btn-secondary w-10 text-sm ml-2">
                <i className="fa-solid fa-circle-plus text-gray-300"></i>
              </button> */}
              </div>
            )}
          </div>
        );
      }
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
