import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import { useSendMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Home: NextPage = () => {
  const [send] = useSendMutation();

  return (
    <div>
      <Head>
        <title>Discord Clone - Send</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h3>Send Message</h3>

        <Formik
          initialValues={{ receiverId: 0, msg: "" }}
          onSubmit={async (values, { setErrors }) => {
            const response = await send({ variables: values });
            if (response.data?.send.errors) {
              console.log(response.data?.send.errors);
              setErrors(toErrorMap(response.data.send.errors));
              // setErrors({ username: "hi" });
            } else if (response.data?.send.message) {
              // worked
              // router.push("/");
              console.log("worked");
              socket.emit("received");
            }

            // actions.setSubmitting(false);
          }}
        >
          {({ handleSubmit, isSubmitting }) => (
            <Form onSubmit={handleSubmit}>
              <label htmlFor="receiverId">Receiver ID</label>
              <Field type="number" name="receiverId" />
              <ErrorMessage name="receiverId" />
              <br />

              <label htmlFor="msg">Message</label>
              <Field name="msg" />

              <button type="submit" disabled={isSubmitting}>
                Send
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
