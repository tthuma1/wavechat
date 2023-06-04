import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useForgotPasswordMutation } from "../generated/graphql";
import Head from "next/head";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <div className="flex justify-center h-screen">
      <Head>
        <title>WaveChat - Forgot Password</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center text-center bg-gray-200 rounded-lg shadow-lg px-28 dark:bg-gray-850 my-28">
        <h2 className="mt-16 mb-16 text-4xl font-medium">Forgot Password</h2>
        <Formik
          initialValues={{ email: "" }}
          onSubmit={async values => {
            await forgotPassword({ variables: values });
            setComplete(true);
          }}
        >
          {({ isSubmitting }) =>
            complete ? (
              <div>
                if an account with that email exists, we sent you can email
              </div>
            ) : (
              <Form className="flex flex-col align-start">
                <label htmlFor="email" className="w-fit">
                  Email:
                </label>
                <Field
                  name="email"
                  placeholder="email"
                  label="Email"
                  type="email"
                  className="my-2 input-settings"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 mt-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500 disabled:text-gray-300 w-fit"
                >
                  Forgot password
                </button>
              </Form>
            )
          }
        </Formik>
      </main>

      <footer></footer>
    </div>
  );
};

export default ForgotPassword;
