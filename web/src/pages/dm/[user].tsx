import { create } from "domain";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useGetUserLazyQuery,
  useMeQuery,
  useRetrieveDmQuery,
} from "../../generated/graphql";
import { io } from "socket.io-client";
import { useState } from "react";
import { formatDate } from "../../utils/formatDate";
import Send from "../../components/Send";

const socket = io("http://localhost:4000");

const User = () => {
  const router = useRouter();
  const { user: quser } = router.query;
  let messages: any = [];
  // const [messages, setMessages] = useState<any[]>([]);

  // if (typeof user === "string") {
  const { data, loading, refetch } = useRetrieveDmQuery({
    variables: { receiverId: parseFloat(quser as string) },
  });
  //   }

  const { data: meData, loading: meLoading } = useMeQuery();

  let allLoaded = false;

  if (!loading && typeof data !== "undefined" && !meLoading) {
    if (data!.retrieveDM!.messages !== null) {
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
        let sender: string = senders.find(
          el => el.id == message.senderId
        )!.username;

        messages.push(
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
  }

  socket.on("received", async () => {
    // console.log("received in [user].tsx");
    refetch();
  });

  if (allLoaded) {
    return (
      <div className="w-screen flex flex-col items-center">
        <Head>
          <title>{}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="h-[80vh] w-9/12 bg-gray-800 px-20 py-8 mt-16 rounded-md overflow-y-scroll scrollbar-colored ">
          {messages}
          <Send receiverId={quser} />
        </div>

        {/* {messages.map((message, i) => {
        return (
          <div key={i}>
            <span>{message.createdAt}</span>
            <p>{message.msg}</p>
          </div>
        );
      })} */}
        <div className="flex my-4 w-9/12 justify-start px-20 items-start">
          <img src="/avatar.jpg" className="w-8 h-8 rounded-full mr-4" />
          <span className="font-semibold pr-2">{meData!.me!.username}</span>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default User;
