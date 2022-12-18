import { create } from "domain";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMeQuery, useRetrieveQuery } from "../generated/graphql";

const User = () => {
  const router = useRouter();
  const { user } = router.query;
  let messages = [];
  // if (typeof user === "string") {
  const { data, loading } = useRetrieveQuery({
    variables: { receiverId: parseFloat(user as string) },
  });
  //   }

  if (!loading) {
    if (data!.retrieve!.messages !== null) {
      for (let i = 0; i < data!.retrieve!.messages!.length; i++) {
        let createdAt = new Date(
          parseInt(data!.retrieve!.messages![i].createdAt)
        );
        messages.push(
          <div key={i}>
            <span>{createdAt.toLocaleString()}</span>
            <p>{data!.retrieve!.messages![i].msg}</p>
          </div>
        );
      }
    }
  }

  return (
    <div>
      <Head>
        <title>{}</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {messages}
    </div>
  );
};

export default User;
