import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
// import { useMeQuery } from "../generated/graphql";
import { useSendDmMutation } from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000");

const Send: NextPage<{ receiverId: string | string[] | undefined }> = props => {
  const [sendDM] = useSendDmMutation();

  return (
    <div className="sticky">
      <Formik
        initialValues={{
          receiverId: parseInt(props.receiverId as string),
          msg: "",
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await sendDM({ variables: values });
          if (response.data?.sendDM.errors) {
            console.log(response.data?.sendDM.errors);
            setErrors(toErrorMap(response.data.sendDM.errors));
            // setErrors({ username: "hi" });
          } else if (response.data?.sendDM.message) {
            // worked
            // router.push("/");
            console.log("worked");
            socket.emit("received");
            resetForm();
          }

          // actions.setSubmitting(false);
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-gray-750 px-4 py-2 rounded-md flex"
          >
            {/* <label htmlFor="receiverId">Receiver ID</label>
            <Field type="number" name="receiverId" />
            <ErrorMessage name="receiverId" />
            <br /> */}

            {/* <label htmlFor="msg">Message</label> */}
            <Field
              name="msg"
              placeholder="Start typing..."
              className="bg-gray-750 outline-none w-full"
              autoFocus
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 py-2 px-4 rounded-md font-semibold text-sm"
            >
              Send
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Send;
