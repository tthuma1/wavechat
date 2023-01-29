import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

const Login: NextPage = () => {
  const [login] = useLoginMutation();

  return (
    <div className="h-screen flex justify-center">
      <Head>
        <title>Discord Clone - Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-col px-28 text-center bg-gray-850 my-28 rounded-lg shadow-lg">
        <h2 className="text-4xl font-medium mt-16 mb-16">Log In</h2>

        <Formik
          initialValues={{ usernameOrEmail: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await login({ variables: values });
            if (response.data?.login.errors) {
              console.log(response.data?.login.errors);
              setErrors(toErrorMap(response.data.login.errors));
              // setErrors({ username: "hi" });
            } else if (response.data?.login.user) {
              // worked
              // router.push("/");
              window.location.reload();
              // console.log("worked");
            }

            // actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              {/* <label htmlFor="usernameOrEmail">Username or email</label> */}
              <Field
                name="usernameOrEmail"
                placeholder="Username or email"
                className="input"
              />
              <ErrorMessage name="usernameOrEmail" />
              <br />

              {/* <label htmlFor="password">Password</label> */}
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="mt-4 input"
              />
              <ErrorMessage name="password" />
              <br />

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 bg-blue-600 py-4 px-8 text-lg rounded-lg font-medium hover:bg-blue-700 cursor-pointer shadow-md"
              >
                Log In
              </button>
            </Form>
          )}
        </Formik>
      </main>

      <footer></footer>
    </div>
  );
};

export default Login;
