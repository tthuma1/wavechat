import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import { useLoginMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

const Home: NextPage = () => {
  const [login] = useLoginMutation();

  return (
    <div>
      <Head>
        <title>Discord Clone - Login</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h3>Login</h3>

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
              <label htmlFor="usernameOrEmail">Username or email</label>
              <Field name="usernameOrEmail" />
              <ErrorMessage name="usernameOrEmail" />
              <br />

              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" />
              <br />

              <button type="submit" disabled={isSubmitting}>
                Login
              </button>
            </Form>
          )}
        </Formik>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
