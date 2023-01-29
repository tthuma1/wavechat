import type { NextComponentType } from "next";
import {
  useGetFriendsQuery,
  useGetUserLazyQuery,
  useMeQuery,
} from "../generated/graphql";

const FriendList: NextComponentType = () => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: friendsData, loading: friendsLoading } = useGetFriendsQuery({
    variables: { userId: meData?.me?.id! }, //parseFloat(meData.me.id) },
  });

  const [getUser, { data: getUserData, loading: getUserLoading }] =
    useGetUserLazyQuery();

  let friends: any = [];

  if (!meLoading && meData?.me) {
    if (!friendsLoading && friendsData) {
      // console.log(friendsData.getFriends);
      for (const friend of friendsData.getFriends) {
        friends.push(
          <a
            href={"/" + friend.id}
            key={friend.username}
            className="text-lg bg-gray-700 p-4 rounded-md hover:bg-gray-750"
          >
            <img
              src="/avatar.jpg"
              className="w-10 h-10 inline rounded-full mr-4"
            />
            {friend.username}
          </a>
        );
      }
    }
  }

  return (
    <div className="bg-gray-800 grid gap-8 grid-rows-4 grid-cols-4 w-[80vw] px-16 py-16 mx-10">
      {friends}
    </div>
  );
};

export default FriendList;
