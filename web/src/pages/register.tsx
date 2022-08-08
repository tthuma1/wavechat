import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
import { ApolloClient, gql, InMemoryCache, useQuery } from "@apollo/client";
// import { useMeQuery } from "../generated/graphql";
import { useRegisterMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";

/*
function DisplayLocations() {
  const { loading, error, data } = useMeQuery();

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.log(error);
    return <p>Error :(</p>;
  }

  //   return data.locations.map(({ id, name, description, photo }) => (
  //     <div key={id}>
  //       <h3>{name}</h3>
  //       <img width="400" height="250" alt="location-reference" src={`${photo}`} />
  //       <br />
  //       <b>About this location:</b>
  //       <p>{description}</p>
  //       <br />
  //     </div>
  // ));
  return <p>nice</p>;
}
*/

const Home: NextPage = () => {
  const [register] = useRegisterMutation();

  return (
    <div>
      <Head>
        <title>Discord Clone - Register</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h3>Register</h3>
        {/* <DisplayLocations /> */}

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
            }

            // actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <label htmlFor="username">Username</label>
              <Field name="username" />
              <ErrorMessage name="username" />
              <br />

              <label htmlFor="email">Email (optional)</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" />
              <br />

              <label htmlFor="password">Password</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" />
              <br />

              <button type="submit" disabled={isSubmitting}>
                Register
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
