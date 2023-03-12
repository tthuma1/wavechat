import type { NextComponentType, NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useGetFriendsQuery,
  useGetUserLazyQuery,
  useMeQuery,
} from "../generated/graphql";

const FriendList: NextPage<{ type: number }> = props => {
  const router = useRouter();
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: friendsData, loading: friendsLoading } = useGetFriendsQuery({
    variables: { userId: meData?.me?.id! }, //parseFloat(meData.me.id) },
  });

  // const [getUser, { data: getUserData, loading: getUserLoading }] =
  //   useGetUserLazyQuery();

  let friends: any = [];

  if (!meLoading && meData?.me) {
    if (!friendsLoading && friendsData) {
      // console.log(friendsData.getFriends);
      for (const friend of friendsData.getFriends) {
        if (props.type == 1) {
          friends.push(
            // <Link href={"/dm/" + friend.id}>
            <a
              href={"/dm/" + friend.id}
              key={friend.username}
              className="text-lg bg-gray-700 p-4 rounded-md hover:bg-gray-750"
            >
              <img
                src={
                  "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                  friend.avatar
                }
                className="w-10 h-10 inline rounded-full mr-4"
              />
              {friend.username}
            </a>
            // </Link>
          );
        } else if (props.type == 2) {
          // on dms, groups
          friends.push(
            // <Link
            //   href={"/dm/" + friend.id}
            //   // onClick={() => router.push("/dm/" + friend.id)}
            // >
            <a
              href={"/dm/" + friend.id}
              key={friend.username}
              className="bg-gray-700 p-4 rounded-md hover:bg-gray-750"
            >
              <div className="flex items-center">
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
            </a>
            // </Link>
          );
        }
      }
    }
  }

  if (props.type == 1) {
    return (
      <div className="flex justify-center items-center">
        <div className="bg-gray-800 w-[80vw] px-16 py-16 mx-10">
          <p className="mb-8">Friends:</p>
          <div className="grid gap-8 grid-rows-4 grid-cols-4">{friends}</div>
        </div>
      </div>
    );
  } else {
    return <div className="grid gap-4 grid-cols-1 w-52 h-fit">{friends}</div>;
  }
};

export default FriendList;
