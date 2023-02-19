import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  useMeQuery,
  useRetrieveInChannelQuery,
  useChannelToGroupQuery,
} from "../../generated/graphql";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import Send from "../../components/Send";
import { NextPage } from "next";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import React from "react";
import ChannelList from "../../components/ChannelList";

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

  let allLoaded = false;

  if (
    !loading &&
    typeof data !== "undefined" &&
    !meLoading &&
    meData!.me != null &&
    !groupLoading &&
    groupData
  ) {
    if (data!.retrieveInChannel!.messages !== null) {
      for (let i = 0; i < data!.retrieveInChannel!.messages!.length; i++) {
        let createdAt = new Date(
          parseInt(data!.retrieveInChannel!.messages![i].createdAt)
        );
        const dateOut = formatDate(new Date(createdAt));

        const senders = data!.retrieveInChannel!.users!;
        const message = data!.retrieveInChannel!.messages![i];
        let sender: string | undefined = senders.find(
          el => el.id == message.senderId
        )!.username;

        if (sender)
          messages.unshift(
            <div key={i} className="flex my-4">
              <img src="/avatar.jpg" className="w-8 h-8 rounded-full mr-4" />
              <div>
                <span className="font-semibold py-2 pr-2">{sender}</span>
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
    Router.push("/login");
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

  useEffect(() => {
    // console.log(currOffset);
    if (data) fetchMore({ variables: { offset: currOffset, limit: 10 } });
  }, [currOffset]);

  if (allLoaded) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>{}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="ml-10 mt-10 flex flex-col justify-between">
          <ChannelList groupId={groupData!.channelToGroup.group?.id} />
          <div className="flex mt-8 justify-start items-start w-full">
            <img src="/avatar.jpg" className="w-8 h-8 rounded-full mr-4" />
            <span className="font-semibold pr-2">{meData!.me!.username}</span>
          </div>
        </div>
        <div className="mt-10 w-full mr-20 ml-10">
          <div className="h-[80vh] bg-gray-800 rounded-t-md scrollbar-colored">
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
          <div className="bg-gray-800 px-6 py-3 rounded-b-md">
            <Send receiverId={qchannelId} type="group" />
          </div>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Channel;
