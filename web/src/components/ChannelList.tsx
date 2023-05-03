import type { NextPage } from "next";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";
import { io } from "socket.io-client";
import {
  useGetChannelsInGroupQuery,
  useGetGroupInfoQuery,
  useMeQuery,
} from "../generated/graphql";
import { socket } from "../utils/socket";

const ChannelList: NextPage<{ groupId: number | undefined }> = props => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const {
    data: channelsData,
    loading: channelsLoading,
    refetch,
  } = useGetChannelsInGroupQuery({
    variables: { groupId: props.groupId as number },
  });

  const { data: groupData, loading: groupLoading } = useGetGroupInfoQuery({
    variables: { groupId: props.groupId as number },
  });

  let isAdmin = false;

  // const [getUser, { data: getUserData, loading: getUserLoading }] =
  //   useGetUserLazyQuery();

  let channels: any = [];

  if (!meLoading && meData?.me && !groupLoading && groupData?.getGroupInfo) {
    if (!channelsLoading && channelsData?.getChannelsInGroup) {
      // console.log(channelsData.getFriends);
      for (const channel of channelsData.getChannelsInGroup.channels!) {
        channels.push(
          <Link key={channel.id} href={"/channel/" + channel.id}>
            <div
              // href={"/channel/" + channel.id}
              // onClick={() => router.push("/dm/" + friend.id)}
              key={channel.id}
              className="bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-750 hover:cursor-pointer shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="overflow-hidden text-ellipsis">
                  {channel.name}
                </span>
                {channel.isPrivate && (
                  <i className="fa-solid fa-lock text-gray-800 dark:text-gray-300 text-sm"></i>
                )}
              </div>
            </div>
          </Link>
        );
      }
    }

    if (meData.me.id == groupData.getGroupInfo.group?.adminId) {
      isAdmin = true;
    }
  }

  const showModal = () => {
    let modal = document.getElementById("createModal");

    modal?.classList.remove("hidden");
    modal?.classList.add("flex");

    document.getElementById("createInput")?.focus();

    if (modal) {
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = event => {
        if (event.target == modal) {
          modal!.classList.remove("flex");
          modal!.classList.add("hidden");
        }
      };
    }
  };

  socket.on("channel created", async () => {
    refetch();
  });

  socket.on("channel renamed", async () => {
    refetch();
  });

  socket.on("channel deleted", async () => {
    refetch();
  });

  socket.on("visibility changed", async () => {
    refetch();
  });

  return (
    <div className="w-40 grid gap-4 grid-cols-1 h-fit">
      {channels}
      {isAdmin && (
        <div
          className="btn-secondary text-sm flex justify-between items-center"
          onClick={showModal}
        >
          New Channel
          <i className="fa-solid fa-plus-circle text-gray-800 dark:text-gray-300"></i>
        </div>
      )}
    </div>
  );
};

export default ChannelList;
