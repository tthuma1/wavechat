import React, { useState } from "react";
import { NextPage } from "next";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import {
  MeDocument,
  MeQuery,
  useVerifyEmailMutation,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";

const VerifyEmail: NextPage = () => {
  const router = useRouter();

  const [verifyEmail, { data, loading }] = useVerifyEmailMutation({
    variables: {
      token: typeof router.query.token === "string" ? router.query.token : "",
    },
  });

  verifyEmail();

  if (!loading) {
    if (!data?.verifyEmail.errors) {
      return <div>Error verifying email</div>;
    } else {
      return <div>Email verified!</div>;
    }
  } else {
    return <div>Loading...</div>;
  }
};

export default VerifyEmail;
