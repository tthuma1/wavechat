import type { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import { useGetChannelsInGroupQuery, useMeQuery } from "../generated/graphql";

const ChannelList: NextPage<{ groupId: number | undefined }> = props => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const { data: channelsData, loading: channelsLoading } =
    useGetChannelsInGroupQuery({
      variables: { groupId: props.groupId as number },
    });

  // const [getUser, { data: getUserData, loading: getUserLoading }] =
  //   useGetUserLazyQuery();

  let channels: any = [];

  if (!meLoading && meData?.me) {
    if (!channelsLoading && channelsData?.getChannelsInGroup) {
      // console.log(channelsData.getFriends);
      for (const channel of channelsData.getChannelsInGroup.channels!) {
        channels.push(
          <Link href={"/channel/" + channel.id}>
            <div
              // href={"/channel/" + channel.id}
              // onClick={() => router.push("/dm/" + friend.id)}
              key={channel.id}
              className="bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-750 hover:cursor-pointer"
            >
              <div className="flex items-center">
                <span className="overflow-hidden text-ellipsis">
                  {channel.name}
                </span>
              </div>
            </div>
          </Link>
        );
      }
    }
  }

  return <div className="w-40 grid gap-4 grid-cols-1 h-fit">{channels}</div>;
};

export default ChannelList;
