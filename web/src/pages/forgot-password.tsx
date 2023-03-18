import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { useForgotPasswordMutation } from "../generated/graphql";
import Head from "next/head";

const ForgotPassword: React.FC<{}> = ({}) => {
  const [complete, setComplete] = useState(false);
  const [forgotPassword] = useForgotPasswordMutation();
  return (
    <div className="h-screen flex justify-center">
      <Head>
        <title>Discord Clone - Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-col px-28 text-center bg-gray-850 my-28 rounded-lg shadow-lg">
        <h2 className="text-4xl font-medium mt-16 mb-16">Forgot Password</h2>
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
                  className="input-settings my-2"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 py-2 px-4 rounded-md text-sm mt-2 hover:bg-blue-500 disabled:text-gray-300 w-fit"
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
