import type { NextComponentType } from "next";
import { useGetFriendsQuery, useMeQuery } from "../generated/graphql";

const FriendList: NextComponentType = () => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: friendsData, loading: friendsLoading } = useGetFriendsQuery({
    variables: { userId: meData?.me?.id! }, //parseFloat(meData.me.id) },
  });

  let friends: any = [];

  if (!meLoading && meData?.me) {
    if (!friendsLoading && friendsData) {
      // console.log(friendsData.getFriends);
      friendsData.getFriends.forEach(friendship => {
        let friend;
        if (friendship.user1Id == meData!.me!.id) {
          friend = friendship.user2Id;
        } else {
          friend = friendship.user1Id;
        }

        friends.push(
          <div key={friend}>
            <a href={"/" + friend}>{friend}</a>
            <br />
          </div>
        );
      });
    }
  }

  return <div>{friends}</div>;
};

export default FriendList;
