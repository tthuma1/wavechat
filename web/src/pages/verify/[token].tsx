import React, { useEffect, useState } from "react";
import { NextPage } from "next";
import { useVerifyEmailMutation } from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";

const VerifyEmail: NextPage = () => {
  const router = useRouter();
  const { token: qtoken } = router.query;

  const [verifyEmail, { data, loading }] = useVerifyEmailMutation();

  useEffect(() => {
    (async () => {
      const response = await verifyEmail({
        variables: {
          token: typeof qtoken === "string" ? qtoken : "",
        },
      });

      if (!response.data?.verifyEmail.errors) {
        router.push("/app");
      }
    })();
  }, [qtoken]);

  return (
    <div className="h-screen flex justify-center items-center">
      <Head>
        <title>WaveChat - Verify Email</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading || !data?.verifyEmail ? (
        <div>Verifying email...</div>
      ) : data?.verifyEmail.errors ? (
        <div>Error verifying email.</div>
      ) : (
        <div>Email verified!</div>
      )}
    </div>
  );
};

export default VerifyEmail;
