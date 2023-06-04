import React, { useState } from "react";
import { NextPage } from "next";
import { Formik, Form, ErrorMessage, Field } from "formik";
import { toErrorMap } from "../../utils/toErrorMap";
import {
  MeDocument,
  MeQuery,
  useChangePasswordTokenMutation,
} from "../../generated/graphql";
import { useRouter } from "next/router";
import NextLink from "next/link";
import Head from "next/head";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [changePassword] = useChangePasswordTokenMutation();
  const [tokenError, setTokenError] = useState("");
  return (
    <div className="flex justify-center h-screen">
      <Head>
        <title>WaveChat - Change Password</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center text-center bg-gray-200 rounded-lg shadow-lg px-28 dark:bg-gray-850 my-28">
        <h2 className="mt-16 mb-16 text-4xl font-medium">Change Password</h2>
        <Formik
          initialValues={{ newPassword: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await changePassword({
              variables: {
                newPassword: values.newPassword,
                token:
                  typeof router.query.token === "string"
                    ? router.query.token
                    : "",
              },
              // update cache instead of refetching meData
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: data?.changePasswordToken.user,
                  },
                });
              },
            });
            if (response.data?.changePasswordToken.errors) {
              const errorMap = toErrorMap(
                response.data.changePasswordToken.errors
              );
              if ("token" in errorMap) {
                setTokenError(errorMap.token);
              }
              setErrors(errorMap);
            } else if (response.data?.changePasswordToken.user) {
              // worked
              router.push("/app");
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col justify-start w-full">
              <label htmlFor="newPassword" className="w-fit">
                New password:
              </label>
              <br />
              <Field
                name="newPassword"
                placeholder="new password"
                type="password"
                className="my-3 input-settings"
              />

              {tokenError ? <ErrorMessage name="newPassword" /> : null}
              <br />

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 mt-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500 disabled:text-gray-300 w-fit"
              >
                Change Password
              </button>
            </Form>
          )}
        </Formik>
      </main>

      <footer></footer>
    </div>
  );
};

export default ChangePassword;
