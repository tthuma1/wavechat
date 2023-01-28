import { create } from "domain";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMeQuery, useRetrieveDmQuery } from "../generated/graphql";
import { io } from "socket.io-client";
import { useState } from "react";

const socket = io("http://localhost:4000");

const User = () => {
  const router = useRouter();
  const { user } = router.query;
  let messages: any = [];
  // const [messages, setMessages] = useState<any[]>([]);

  // if (typeof user === "string") {
  const { data, loading, refetch } = useRetrieveDmQuery({
    variables: { receiverId: parseFloat(user as string) },
  });
  //   }

  if (!loading && typeof data !== "undefined") {
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

        messages.push(
          <div key={i}>
            <span>{createdAt.toLocaleString()}</span>
            <p>{data!.retrieveDM!.messages![i].msg}</p>
          </div>
        );
      }
    }
  }

  socket.on("received", async () => {
    // console.log("received in [user].tsx");
    refetch();
  });

  return (
    <div>
      <Head>
        <title>{}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {messages}

      {/* {messages.map((message, i) => {
        return (
          <div key={i}>
            <span>{message.createdAt}</span>
            <p>{message.msg}</p>
          </div>
        );
      })} */}
    </div>
  );
};

export default User;
