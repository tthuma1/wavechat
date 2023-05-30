import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useJoinGroupWithTokenMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";

const JoinGroup: NextPage = () => {
  const router = useRouter();
  const { token: qtoken } = router.query;

  const [joinGroupWithToken, { data, loading }] =
    useJoinGroupWithTokenMutation();

  useEffect(() => {
    (async () => {
      const response = await joinGroupWithToken({
        variables: {
          token: typeof qtoken === "string" ? qtoken : "",
        },
      });

      if (response.data?.joinGroupWithToken.firstChannelId) {
        router.push(
          "/channel/" + response.data.joinGroupWithToken.firstChannelId
        );
      }
    })();
  }, [qtoken]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Head>
        <title>WaveChat - Join Group</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading || !data?.joinGroupWithToken ? (
        <div>Joining group...</div>
      ) : data?.joinGroupWithToken.errors ? (
        <div>Error joining group.</div>
      ) : (
        <div>Group joined!</div>
      )}
    </div>
  );
};

export default JoinGroup;
