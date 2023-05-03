import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { useState } from "react";
import Link from "next/link";

const Register: NextPage = () => {
  const [register] = useRegisterMutation();
  const [isSent, setIsSent] = useState(false);

  return (
    <div className="h-screen flex justify-center">
      <Head>
        <title>WaveChat - Register</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex items-center flex-col px-28 text-center bg-gray-200 dark:bg-gray-850 my-28 rounded-lg shadow-lg">
        <h2 className="text-4xl font-medium mt-16 mb-16">Register</h2>

        <Formik
          initialValues={{ username: "", email: "", password: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await register({
              variables: { options: values },
            });
            if (response.data?.register.errors) {
              console.log(response.data?.register.errors);
              setErrors(toErrorMap(response.data.register.errors));
              // setErrors({ username: "hi" });
            } else if (response.data?.register.user) {
              // worked
              // router.push("/");
              console.log("worked");
              setIsSent(true);
            }

            // actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting, errors }) => (
            <Form onSubmit={handleSubmit}>
              {/* <label htmlFor="username">Username</label> */}
              <Field
                name="username"
                placeholder="Username"
                className="input-light dark:input"
              />
              {errors.username && (
                <div className="mt-2 text-red-500 text-sm">
                  <ErrorMessage name="username" />
                </div>
              )}
              {!errors.username && <br />}

              {/* <label htmlFor="email">Email</label> */}
              <Field
                type="email"
                name="email"
                placeholder="Email"
                className="input-light dark:input mt-4"
              />
              {errors.email && (
                <div className="mt-2 text-red-500 text-sm">
                  <ErrorMessage name="email" />
                </div>
              )}
              {!errors.email && <br />}

              {/* <label htmlFor="password">Password</label> */}
              <Field
                type="password"
                name="password"
                placeholder="Password"
                className="input-light dark:input mt-4"
              />
              {errors.password && (
                <div className="mt-2 text-red-500 text-sm">
                  <ErrorMessage name="password" />
                </div>
              )}
              {!errors.password && <br />}

              {isSent && <div className="mt-2">Confirmation email sent!</div>}

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-100 mt-8 bg-blue-600 py-2 px-8 text-lg rounded-lg font-medium hover:bg-blue-700 cursor-pointer shadow-md"
              >
                Register
              </button>
              <Link href="/login">
                <div className="hover:cursor-pointer text-sm mt-2 text-gray-500 hover:text-gray-600 dark:hover:text-gray-400">
                  Already have an account? Log In
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

export default Register;
