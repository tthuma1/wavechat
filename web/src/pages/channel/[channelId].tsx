import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  useMeQuery,
  useRetrieveInChannelQuery,
  useChannelToGroupQuery,
  useLeaveGroupMutation,
  useIsCurrentInChannelQuery,
  useGetChannelsInGroupQuery,
  useGetChannelInfoQuery,
} from "../../generated/graphql";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import Send from "../../components/Send";
import { NextPage } from "next";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import React from "react";
import ChannelList from "../../components/ChannelList";
import UsersList from "../../components/UsersList";
import CreateChannelModal from "../../components/CreateChannelModal";
import EditChannelModal from "../../components/EditChannelModal";

const socket = io("http://localhost:4000");

const Channel: NextPage = () => {
  const router = useRouter();
  const { channelId: qchannelId } = router.query;
  const virtRef = React.useRef<VirtuosoHandle>(null);
  let messages: any = [];
  let initial_item_count = 0;

  const [firstLoad, setFirstLoad] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(1e9);
  const [currOffset, setCurrOffset] = useState(5);

  const { data, loading, refetch, fetchMore } = useRetrieveInChannelQuery({
    variables: {
      channelId: parseFloat(qchannelId as string),
      offset: 0,
      limit: 15,
    },
  });

  const { data: meData, loading: meLoading } = useMeQuery();

  const { data: groupData, loading: groupLoading } = useChannelToGroupQuery({
    variables: { channelId: parseFloat(qchannelId as string) },
  });

  const { data: channelData, loading: channelLoading } = useGetChannelInfoQuery(
    {
      variables: { channelId: parseFloat(qchannelId as string) },
    }
  );

  const { data: isInChannelData, loading: isInChannelLoading } =
    useIsCurrentInChannelQuery({
      variables: { channelId: parseFloat(qchannelId as string) },
    });

  const [leaveGroup] = useLeaveGroupMutation();

  let allLoaded = false;

  useEffect(() => {
    refetch({
      channelId: parseFloat(qchannelId as string),
      offset: 0,
      limit: 15,
    });

    setCurrOffset(15), setFirstItemIndex(1e9);
    setFirstLoad(true);
    initial_item_count = 0;
  }, [qchannelId]);

  if (
    !loading &&
    typeof data !== "undefined" &&
    !meLoading &&
    meData!.me != null &&
    !groupLoading &&
    groupData &&
    !channelLoading &&
    channelData &&
    !isInChannelLoading &&
    isInChannelData
  ) {
    if (!isInChannelData.isCurrentInChannel) router.push("/app");

    if (data!.retrieveInChannel!.messages !== null) {
      for (let i = 0; i < data!.retrieveInChannel!.messages!.length; i++) {
        let createdAt = new Date(
          parseInt(data!.retrieveInChannel!.messages![i].createdAt)
        );
        const dateOut = formatDate(new Date(createdAt));

        const senders = data!.retrieveInChannel!.users!;
        const message = data!.retrieveInChannel!.messages![i];
        let sender = senders.find(el => el.id == message.senderId)!;

        if (sender)
          messages.unshift(
            <div key={i} className="flex my-4">
              <img
                src={
                  "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                  sender.avatar
                }
                className="w-8 h-8 rounded-full mr-4"
              />
              <div>
                <span className="font-semibold py-2 pr-2">
                  {sender.username}
                </span>
                <span className="text-gray-400 text-sm py-2">{dateOut}</span>
                <p>{message.msg}</p>
              </div>
            </div>
          );
      }
    }

    allLoaded = true;
    initial_item_count = messages.length - 1;

    // quick hack because it doesn't scroll to bottom on load
    setTimeout(() => {
      if (virtRef.current != null && firstLoad) {
        setFirstLoad(() => false);
        virtRef.current!.scrollToIndex({
          index: messages.length - 1,
          behavior: "smooth",
        });
      }
    }, 100);
  }

  if (!meLoading && meData?.me == null) {
    router.push("/login");
  }

  socket.on("received", async () => {
    // console.log("received in [channel].tsx");
    refetch();
  });

  const prependItems = async () => {
    if (data!.retrieveInChannel!.hasMore) {
      setCurrOffset(() => currOffset + 10);
      setFirstItemIndex(() => firstItemIndex - 10);
    }
  };

  const handleLeave = async (id: number) => {
    const response = await leaveGroup({ variables: { groupId: id } });

    if (response.data?.leaveGroup) {
      router.push("/app");
    }
  };

  useEffect(() => {
    // console.log(currOffset);
    if (data) fetchMore({ variables: { offset: currOffset, limit: 10 } });
  }, [currOffset]);

  const showEditModal = () => {
    let modal = document.getElementById("editModal");

    modal?.classList.remove("hidden");
    modal?.classList.add("flex");
    document.getElementById("editInput")?.focus();
  };

  if (allLoaded) {
    return (
      <div className="flex justify-center w-screen h-screen">
        <Head>
          <title>{}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="mt-10 ml-10 flex flex-col justify-between">
          <ChannelList groupId={groupData!.channelToGroup.group?.id} />
          <Link href="/settings">
            <div className="pt-4 mb-10 justify-start items-start w-full border-t border-gray-500 ">
              <div className="flex hover:cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 px-3 py-2 rounded-md items-center">
                <img
                  src={
                    "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                    meData?.me?.avatar
                  }
                  className="w-8 h-8 rounded-full mr-4"
                />
                <span className="font-semibold pr-2">
                  {meData!.me!.username}
                </span>
              </div>
            </div>
          </Link>
        </div>

        <CreateChannelModal
          groupId={groupData?.channelToGroup.group?.id as number}
        />

        <EditChannelModal
          channelId={channelData?.getChannelInfo.channel?.id as number}
        />

        <div className="mt-10 flex-1 mx-8 flex flex-col h-[90vh]">
          <div className="bg-gray-100 dark:bg-gray-800 flex py-2 px-3 items-center rounded-t-md">
            <div className="flex-1 flex justify-start">
              {meData?.me?.id == groupData?.channelToGroup.group?.adminId && (
                <div
                  className="btn-secondary text-sm text-gray-800 dark:text-gray-300"
                  onClick={showEditModal}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </div>
              )}
            </div>
            <div>
              {groupData?.channelToGroup.group?.name} -{" "}
              {channelData?.getChannelInfo.channel?.name}
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className="btn-secondary text-sm"
                onClick={() => {
                  handleLeave(groupData?.channelToGroup.group?.id as number);
                }}
              >
                Leave Group
              </div>
            </div>
          </div>
          <div className="w-full h-px bg-gray-600"></div>
          <div className="flex-auto bg-gray-100 dark:bg-gray-800 scrollbar-colored">
            <Virtuoso
              id="virt"
              data={messages}
              ref={virtRef}
              startReached={prependItems}
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={{
                index: initial_item_count,
                behavior: "smooth",
              }}
              followOutput
              itemContent={(index, message) => (
                <div className="px-12">{message}</div>
              )}
            />
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-b-md">
            <Send receiverId={qchannelId} type="group" />
          </div>
        </div>

        <div className="w-72 mr-10">
          <div className="flex w-60 mb-5">
            <div className="h-10 w-14 mr-5 mt-10 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-center items-center text-gray-800 dark:text-gray-300 text-center hover:bg-gray-200 dark:hover:bg-gray-700">
              <Link href="/settings">
                <a>
                  <i className="fa-solid fa-gear p-4 text-lg"></i>
                </a>
              </Link>
            </div>
            <div className="h-10 w-14 mr-5 mt-10 bg-gray-100 dark:bg-gray-800 rounded-md flex justify-center items-center text-gray-800 dark:text-gray-300 text-center hover:bg-gray-200 dark:hover:bg-gray-700">
              <Link href="/app">
                <a>
                  <i className="fa-solid fa-arrow-left p-4 text-lg"></i>
                </a>
              </Link>
            </div>
          </div>
          <UsersList groupId={groupData!.channelToGroup.group?.id} />
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Channel;
