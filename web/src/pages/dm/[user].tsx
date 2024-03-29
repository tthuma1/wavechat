import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useDeleteMessageMutation,
  useGetUserQuery,
  useMeQuery,
  useRemoveFriendMutation,
  useRetrieveDmQuery,
} from "../../generated/graphql";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { formatDate } from "../../utils/formatDate";
import Send from "../../components/Send";
import { NextPage } from "next";
import FriendList from "../../components/FriendList";
import { Virtuoso, VirtuosoHandle } from "react-virtuoso";
import React from "react";
import { makeVar, useReactiveVar } from "@apollo/client";
import { socket } from "../../utils/socket";

const User: NextPage = () => {
  const router = useRouter();
  const { user: quser } = router.query;
  const virtRef = React.useRef<VirtuosoHandle>(null);
  let messages: any = [];
  let newMessages: any = [];
  let initial_item_count = 0;
  // let currOffset = 0;
  // let firstLoad = true;
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(1e9);
  const [currOffset, setCurrOffset] = useState(15);
  const [topReached, setTopReached] = useState(false);
  // const [messagesState, setMessagesState] = useState<any[]>([]);
  // const [messages, setMessages] = useState<any[]>([]);

  // if (typeof user === "string") {
  const { data, loading, refetch, fetchMore } = useRetrieveDmQuery({
    variables: {
      receiverId: parseFloat(quser as string),
      offset: 0,
      limit: 15,
    },
  });
  //   }

  useEffect(() => {
    refetch({
      receiverId: parseFloat(quser as string),
      offset: 0,
      limit: 15,
    });

    setCurrOffset(15);
    setFirstItemIndex(1e9);
    setFirstLoad(true);
    initial_item_count = 0;
  }, [quser]);

  const { data: meData, loading: meLoading } = useMeQuery();

  const { data: userData, loading: userLoading } = useGetUserQuery({
    variables: { id: parseFloat(quser as string) },
  });

  const [removeFriend] = useRemoveFriendMutation();
  const [deleteMessage] = useDeleteMessageMutation();

  let allLoaded = false;

  if (
    !loading &&
    typeof data !== "undefined" &&
    !meLoading &&
    meData!.me != null &&
    !userLoading &&
    userData?.getUser != null
  ) {
    // console.log(data.retrieveDM?.messages);
    if (data!.retrieveDM!.messages !== null) {
      // console.log(data.retrieveDM?.messages);
      // console.log(data);
      for (let i = 0; i < data!.retrieveDM!.messages!.length; i++) {
        let createdAt = new Date(
          parseInt(data!.retrieveDM!.messages![i].createdAt)
        );
        // setMessages([
        //   ...messages,
        //   {
        //     time: createdAt.toLocaleString(),
        //     msg: data!.retrieve!.messages![i].msg,
        //   },
        // ]);

        //   setMessages([
        //     ...messages,
        //     <div key={i}>
        //       <span>{createdAt.toLocaleString()}</span>
        //       <p>{data!.retrieve!.messages![i].msg}</p>
        //     </div>,
        //   ]);

        const dateOut = formatDate(new Date(createdAt));

        const senders = data!.retrieveDM!.users!;
        const message = data!.retrieveDM!.messages![i];
        let sender = senders.find(el => el.id == message.senderId)!;

        // console.log(message);
        if (sender && message.type == "text") {
          messages.unshift(
            <div className="dropdown">
              <div
                key={i}
                className="flex py-2 hover:bg-gray-150 dark:hover:bg-gray-850 rounded-md px-2"
              >
                <img
                  src={
                    "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                    sender.avatar
                  }
                  className="w-8 h-8 rounded-full mr-4 mt-2"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold pr-2">{sender.username}</span>
                  <span className="text-gray-400 text-sm">{dateOut}</span>
                  <p className="break-words m-0">{message.msg}</p>
                </div>
                {meData?.me.id == message.senderId && (
                  <button
                    className="dropdown-content invisible -mt-3 px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-750 hover:cursor-pointer h-fit"
                    onClick={() => handleDeleteMessage(message.id, i)}
                  >
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </button>
                )}
              </div>
            </div>
          );
        } else if (sender && message.type == "image") {
          messages.unshift(
            <div className="dropdown">
              <div
                key={i}
                className="flex py-2 hover:bg-gray-150 dark:hover:bg-gray-850 rounded-md px-2"
              >
                <img
                  src={
                    "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                    sender.avatar
                  }
                  className="w-8 h-8 rounded-full mr-4 mt-2"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-semibold pr-2">{sender.username}</span>
                  <span className="text-gray-400 text-sm">{dateOut}</span>
                  <div className="pt-2">
                    <img
                      src={
                        "https://s3.eu-central-2.wasabisys.com/wavechat/attachments/" +
                        message.msg
                      }
                      className="max-h-72 rounded-md"
                    />
                  </div>
                </div>

                {meData?.me.id == message.senderId && (
                  <button
                    className="dropdown-content invisible -mt-3 px-2 py-1 rounded-md bg-gray-200 hover:bg-gray-50 dark:bg-gray-900 dark:hover:bg-gray-750 hover:cursor-pointer h-fit"
                    onClick={() => handleDeleteMessage(message.id, i)}
                  >
                    <i className="fa-solid fa-trash text-red-500"></i>
                  </button>
                )}
              </div>
            </div>
          );
        }
      }
    }

    allLoaded = true;

    initial_item_count = messages.length - 1;

    // quick hack because it doesn't scroll to bottom on load
    setTimeout(() => {
      // document.getElementById("virt")!.scrollTop =
      //   document.getElementById("virt")?.scrollHeight;
      // console.log(virtRef.current);
      // console.log("scrolling down", firstLoad);
      // if (virtRef.current != null && firstLoad) {
      //   setFirstLoad(() => false);
      //   virtRef.current!.scrollToIndex({
      //     index: messages.length - 1,
      //     behavior: "smooth",
      //   });
      // }
    }, 100);
  }

  useEffect(() => {
    if (virtRef.current != null) {
      setFirstLoad(() => false);
      virtRef.current.scrollToIndex({
        index: messages.length - 1,
        // align: "start",
        // behavior: "smooth",
      });
    }
    // setMessagesState(messages);
    // console.log(messagesState);
  }, []);

  useEffect(() => {
    if (!meLoading && meData?.me == null) {
      router.push("/login");
    }
  });

  useEffect(() => {
    socket.removeListener("received dm");

    socket.on("received dm", async (receiverId, senderId) => {
      // console.log("received in [user].tsx");
      // console.log(currOffset);
      // if (quser) {
      //   await refetch({
      //     receiverId: parseFloat(quser as string),
      //     offset: 0,
      //     limit: currOffset,
      //   });
      // }

      // if (quser == receiverId) {
      //   refetch({
      //     receiverId: parseFloat(quser as string),
      //     offset: 0,
      //     limit: 15,
      //   });
      //   setCurrOffset(15);
      //   setFirstItemIndex(1e9);
      //   setFirstLoad(true);
      //   initial_item_count = 0;
      // }

      if (quser == receiverId || quser == senderId) {
        await fetchMore({ variables: { offset: 0, limit: 1 } });
        setCurrOffset(() => currOffset + 1);
      }
    });

    socket.on("dm message removed", async (offset, receiverId, senderId) => {
      console.log(quser, receiverId, senderId);
      if (quser == receiverId || quser == senderId) {
        await fetchMore({ variables: { offset, limit: 0 } });
        setCurrOffset(() => currOffset - 1);
      }
    });
  }, [quser]);

  // on unmount
  useEffect(() => {
    return () => {
      socket.removeListener("received dm");
      socket.removeListener("dm message removed");
    };
  }, []);

  const prependItems = async () => {
    // setCurrOffset(() => messages.length);

    if (!topReached) {
      await fetchMore({ variables: { offset: currOffset, limit: 10 } });
      setCurrOffset(() => currOffset + 10);

      // setFirstItemIndex(() => firstItemIndex - 10);
    }

    if (!data?.retrieveDM?.hasMore) setTopReached(true);
  };

  // useEffect(() => {
  //   // console.log(currOffset);
  //   if (data) fetchMore({ variables: { offset: currOffset, limit: 10 } });
  // }, [currOffset]);

  const handleRemove = async (id: number) => {
    const response = await removeFriend({ variables: { friendId: id } });

    if (response.data?.removeFriend) {
      router.push("/app");
    }

    socket.emit("friend removed");
  };

  const handleDeleteMessage = async (id: number, offset: number) => {
    const response = await deleteMessage({
      variables: { deleteMessageId: id },
    });

    if (response.data?.deleteMessage) {
      socket.emit("dm message removed", offset, quser, meData?.me?.id);
    }
  };

  if (allLoaded && router.isReady && quser) {
    return (
      <div className="flex justify-center overflow-hidden w-screen h-screen">
        <Head>
          <title>WaveChat - DM</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="ml-10 mt-10 flex flex-col justify-between">
          <FriendList type={2} />
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
                <div className="font-semibold pr-2">{meData!.me!.username}</div>
              </div>
            </div>
          </Link>
        </div>
        <div className="mt-10 w-full mx-10 flex flex-col h-[90vh]">
          <div className="bg-gray-100 dark:bg-gray-800 flex py-2 px-3 items-center rounded-t-md">
            <div className="flex-1"></div>
            <div className="flex">
              <img
                src={
                  "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                  userData?.getUser?.user?.avatar
                }
                className="w-6 h-6 rounded-full mr-4"
              />
              <span className="pr-2">{userData?.getUser?.user?.username}</span>
            </div>
            <div className="flex-1 flex justify-end">
              <div
                className="btn-secondary text-sm"
                onClick={() => {
                  handleRemove(parseFloat(quser as string));
                }}
              >
                Remove Friend
              </div>
              {/* <div className="ml-3 btn-secondary text-sm" onClick={() => {}}>
                Block
              </div> */}
            </div>
          </div>
          <div className="w-full h-px bg-gray-600"></div>
          {/* {newMessages} */}
          <div className="flex-auto bg-gray-100 dark:bg-gray-800 scrollbar-colored pt-3">
            {/* {messages} */}
            {/* pt-8 pb-2 */}
            <Virtuoso
              id="virt"
              data={messages}
              ref={virtRef}
              startReached={prependItems}
              firstItemIndex={1e9 - messages.length}
              initialTopMostItemIndex={{
                index: initial_item_count,
                // behavior: "smooth",
                // align: "end",
              }}
              followOutput
              itemContent={(index, message) => (
                <div className="px-6">
                  {/* <div className="flex my-4">
                    <img
                      src="/avatar.jpg"
                      className="w-8 h-8 rounded-full mr-4"
                    />
                    <div>
                      <span className="font-semibold py-2 pr-2">
                        {message.sender}
                      </span>
                      <span className="text-gray-400 text-sm py-2">
                        {message.dateOut}
                      </span>
                      <p>{message.msg}</p>
                    </div>
                  </div> */}
                  {message}
                  {/* {index} */}
                </div>
              )}
            />
            {/* <button
              onClick={() =>
                virtRef.current!.scrollToIndex({
                  index: messages.length - 1,
                  behavior: "smooth",
                })
              }
            >
              scroll to bottom
            </button> */}
          </div>
          <div className="bg-gray-100 dark:bg-gray-800 px-6 py-3 rounded-b-md">
            <Send receiverId={quser} type="dm" />
          </div>
          {/* {messages.map((message, i) => {
        return (
          <div key={i}>
            <span>{message.createdAt}</span>
            <p>{message.msg}</p>
          </div>
        );
      })} */}
        </div>
        {/* <Virtuoso
          style={{ height: 400, width: 200 }}
          data={messages}
          initialTopMostItemIndex={{
            index: messages.length - 1,
            // behavior: "smooth",
            // align: "end",
          }}
          startReached={prependItems}
          itemContent={(index, message) => (
            <div className="">
              <div key={index} className="flex my-4">
                <img src="/avatar.jpg" className="w-8 h-8 rounded-full mr-4" />
                <div>
                  <span className="font-semibold py-2 pr-2">
                    {message.sender}
                  </span>
                  <span className="text-gray-400 text-sm py-2">
                    {message.dateOut}
                  </span>
                  <p>{message.msg}</p>
                </div>
              </div>
              {index}
            </div>
          )}
        /> */}

        <div className="h-10 mr-10 mt-10 bg-gray-200 dark:bg-gray-800 rounded-md flex justify-center items-center text-gray-800 dark:text-gray-300 text-center hover:bg-gray-300 dark:hover:bg-gray-700">
          <Link href="/app">
            <a>
              <i className="fa-solid fa-arrow-left p-4 text-lg"></i>
            </a>
          </Link>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default User;
