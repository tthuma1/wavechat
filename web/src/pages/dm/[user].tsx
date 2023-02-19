import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  useGetUserLazyQuery,
  useMeQuery,
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
import { InMemoryCache } from "@apollo/client";
import { offsetLimitPagination } from "@apollo/client/utilities";

const socket = io("http://localhost:4000");

const User: NextPage = () => {
  const router = useRouter();
  const { user: quser } = router.query;
  const virtRef = React.useRef<VirtuosoHandle>(null);
  let messages: any = [];
  let initial_item_count = 0;
  // let currOffset = 0;
  // let firstLoad = true;
  const [firstLoad, setFirstLoad] = useState(true);
  const [firstItemIndex, setFirstItemIndex] = useState(1e9);
  const [currOffset, setCurrOffset] = useState(5);
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

  const { data: meData, loading: meLoading } = useMeQuery();

  let allLoaded = false;

  if (
    !loading &&
    typeof data !== "undefined" &&
    !meLoading &&
    meData!.me != null
  ) {
    if (data!.retrieveDM!.messages !== null) {
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
        let sender: string | undefined = senders.find(
          el => el.id == message.senderId
        )!.username;

        if (sender)
          messages.unshift(
            // {
            //   sender,
            //   dateOut,
            //   msg: message.msg,
            // }
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
      // document.getElementById("virt")!.scrollTop =
      //   document.getElementById("virt")?.scrollHeight;
      // console.log(virtRef.current);
      // console.log("scrolling down", firstLoad);
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
    // console.log("received in [user].tsx");
    refetch();
  });

  const prependItems = async () => {
    // if (virtRef.current != null && firstLoad) {
    //   console.log("aaa");
    //   firstLoad = false;
    //   virtRef.current!.scrollToIndex({
    //     index: messages.length - 1,
    //     behavior: "smooth",
    //   });
    // }

    if (data!.retrieveDM!.hasMore) {
      setCurrOffset(() => currOffset + 10);
      setFirstItemIndex(() => firstItemIndex - 10);
    } else {
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
          <FriendList type={2} />
          <div className="flex mt-8 justify-start items-start w-full">
            <img src="/avatar.jpg" className="w-8 h-8 rounded-full mr-4" />
            <span className="font-semibold pr-2">{meData!.me!.username}</span>
          </div>
        </div>
        <div className="mt-10 w-full mr-20 ml-10">
          <div className="h-[80vh] bg-gray-800 rounded-t-md scrollbar-colored">
            {/* {messages} */}
            {/* pt-8 pb-2 */}
            <Virtuoso
              id="virt"
              data={messages}
              ref={virtRef}
              startReached={prependItems}
              firstItemIndex={firstItemIndex}
              initialTopMostItemIndex={{
                index: initial_item_count,
                behavior: "smooth",
                // align: "end",
              }}
              followOutput
              itemContent={(index, message) => (
                <div className="px-12">
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
          <div className="bg-gray-800 px-6 py-3 rounded-b-md">
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
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default User;
