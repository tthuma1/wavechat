import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import {
  useForgotPasswordMutation,
  useLoginMutation,
  useMeQuery,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useRouter } from "next/router";
import Link from "next/link";

const Login: NextPage = () => {
  const router = useRouter();
  const { data, loading, refetch } = useMeQuery();

  const [login] = useLoginMutation();
  const [forgotPassword] = useForgotPasswordMutation();

  refetch();

  if (!loading && data?.me) router.push("/app");

  return (
    <div className="h-screen flex justify-center">
      <Head>
        <title>WaveChat - Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-col px-28 text-center bg-gray-200 dark:bg-gray-850 my-28 rounded-lg shadow-lg">
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
              router.push("/app");
              // window.location.reload();
              // console.log("worked");
            }

            // actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              {/* <label htmlFor="usernameOrEmail">Username or email</label> */}
              <Field
                name="usernameOrEmail"
                placeholder="Username or email"
                className="input-light dark:input"
              />
              {errors.usernameOrEmail && (
                <div className="mt-2 text-red-500 text-sm">
                  <ErrorMessage name="usernameOrEmail" />
                </div>
              )}

              {!errors.usernameOrEmail && <br />}

              {/* <label htmlFor="password">Password</label> */}
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="mt-4 input-light dark:input"
              />
              {errors.password && (
                <div className="mt-2 text-red-500 text-sm">
                  <ErrorMessage name="password" />
                </div>
              )}
              <Link href="/forgot-password">
                <div className="hover:cursor-pointer text-sm mt-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400 w-fit">
                  Forgot password?
                </div>
              </Link>
              <br />

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-100 mt-8 bg-blue-600 py-2 px-8 text-lg rounded-lg font-medium hover:bg-blue-700 cursor-pointer shadow-md"
              >
                Log In
              </button>
              <Link href="/register">
                <div className="hover:cursor-pointer text-sm mt-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
                  {"Don't have an account? Sign Up"}
                </div>
              </Link>
            </Form>
          )}
        </Formik>
      </main>

      <footer></footer>
    </div>
  );
};

export default Login;
