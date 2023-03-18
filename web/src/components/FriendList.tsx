import type { NextComponentType, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useGetFriendsQuery,
  useGetUserGroupsCurrentQuery,
  useGetUserGroupsQuery,
  useGetUserLazyQuery,
  useMeQuery,
} from "../generated/graphql";

const FriendList: NextPage<{ type: number }> = props => {
  const router = useRouter();
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: friendsData, loading: friendsLoading } = useGetFriendsQuery({
    variables: { userId: meData?.me?.id! }, //parseFloat(meData.me.id) },
  });
  const { data: groupsData, loading: groupsLoading } =
    useGetUserGroupsCurrentQuery();

  // const [getUser, { data: getUserData, loading: getUserLoading }] =
  //   useGetUserLazyQuery();

  let friends: any = [];
  let groups: any = [];

  if (!meLoading && meData?.me) {
    if (!friendsLoading && friendsData) {
      // console.log(friendsData.getFriends);
      for (const friend of friendsData.getFriends) {
        if (props.type == 1) {
          friends.push(
            <Link href={"/dm/" + friend.id}>
              <div
                key={friend.username}
                className="w-40 text-lg bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-750 overflow-hidden text-ellipsis shadow-sm hover:cursor-pointer"
              >
                <div className="overflow-hidden text-ellipsis flex">
                  <img
                    src={
                      "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                      friend.avatar
                    }
                    className="w-8 h-8 inline rounded-full mr-4"
                  />
                  <div
                    className="overflow-hidden text-ellipsis"
                    title={friend.username}
                  >
                    {friend.username}
                  </div>
                </div>
              </div>
            </Link>
          );
        } else if (props.type == 2) {
          // on dms, groups
          friends.push(
            <Link
              href={"/dm/" + friend.id}
              key={friend.username}
              // onClick={() => router.push("/dm/" + friend.id)}
            >
              {/* <a
              href={"/dm/" + friend.id}
              key={friend.username}
              className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-750"
            > */}
              <div className="flex items-center bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-750 hover:cursor-pointer">
                <img
                  src={
                    "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                    friend.avatar
                  }
                  className="w-8 h-8 inline rounded-full mr-4"
                />
                <span className="overflow-hidden text-ellipsis">
                  {friend.username}
                </span>
              </div>
              {/* </a> */}
            </Link>
          );
        }
      }
    }
  }

  if (
    !groupsLoading &&
    groupsData &&
    groupsData.getUserGroupsCurrent.groups &&
    groupsData.getUserGroupsCurrent.firstChannelIds
  ) {
    for (let i = 0; i < groupsData.getUserGroupsCurrent.groups.length; i++) {
      let group = groupsData.getUserGroupsCurrent.groups[i];
      let channelId = groupsData.getUserGroupsCurrent.firstChannelIds[i];
      groups.push(
        <Link href={"/channel/" + channelId}>
          <div
            key={group.name}
            className="bg-gray-700 p-4 rounded-md hover:bg-gray-750 hover:cursor-pointer"
          >
            <div className="flex items-center">
              <span className="overflow-hidden text-ellipsis">
                {group.name}
              </span>
            </div>
          </div>
        </Link>
      );
    }
  }

  if (props.type == 1) {
    return (
      <div className="flex justify-center items-center">
        <div className="bg-gray-800 w-[80vw] px-16 py-8 mx-10 h-[80vh]">
          <div className="flex justify-between h-full">
            <div>
              {/* friend list */}
              <Link href="/search">
                <div className="px-2 py-2 bg-gray-850 w-fit btn-secondary text-sm mb-4">
                  <i className="fa-solid fa-circle-plus text-gray-300 mr-2"></i>
                  Add Friends
                </div>
              </Link>
              <p className="mb-5">Friends:</p>
              <div className="grid gap-8 grid-rows-4 grid-cols-2">
                {friends}
              </div>
            </div>
            <div className="h-full w-px bg-gray-500"></div>
            <div className="flex flex-col">
              <Link href="/search">
                <div className="px-2 py-2 bg-gray-850 w-fit btn-secondary text-sm mb-4">
                  <i className="fa-solid fa-circle-plus text-gray-300 mr-2"></i>
                  Join Group
                </div>
              </Link>
              <p className="mb-5">Groups:</p>
              <div className="overflow-y-scroll scrollbar-colored pr-2">
                <div className="grid gap-8 grid-rows-4 grid-cols-2">
                  {/* <div className="flex flex-col"> */}
                  {groups}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="h-full overflow-y-scroll scrollbar-colored pr-2 mb-4">
        <div className="grid gap-4 grid-cols-1 w-52 h-fit">{friends}</div>
      </div>
    );
  }
};

export default FriendList;
