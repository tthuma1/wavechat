import type { NextPage } from "next";
import Head from "next/head";
// import Link from "next/link";
// import Image from 'next/image'
import { Formik, Form, Field, ErrorMessage } from "formik";
import formik from "formik";
// import { useMeQuery } from "../generated/graphql";
import {
  useSendDmMutation,
  useSendInChannelMutation,
} from "../generated/graphql";
import { toErrorMap } from "../utils/toErrorMap";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import AWS from "aws-sdk";

const socket = io(process.env.NEXT_PUBLIC_DOMAIN!);

const Send: NextPage<{
  receiverId: string | string[] | undefined;
  type: string;
}> = props => {
  const [sendDM] = useSendDmMutation();
  const [sendInChannel] = useSendInChannelMutation();
  const [file, setFile] = useState(new File([""], ""));
  const [fileSrc, setFileSrc] = useState("");

  // const handleFileUpload = (event: any) => {
  //   let reader = new FileReader();
  //   let tmpFile = event.target.files[0];
  //   reader.readAsDataURL(tmpFile);
  //   reader.onloadend = () => {
  //     setFile(reader.result as string);
  //     console.log(file);
  //   };
  // };

  return (
    <div className="sticky">
      <Formik
        initialValues={{
          msg: "",
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          if (props.type == "dm") {
            if (values.msg != "") {
              const response = await sendDM({
                variables: {
                  msg: values.msg,
                  receiverId: parseInt(props.receiverId as string),
                  type: "text",
                },
              });

              if (response.data?.sendDM.errors) {
                console.log(response.data?.sendDM.errors);
                setErrors(toErrorMap(response.data.sendDM.errors));
                // setErrors({ username: "hi" });
              } else if (response.data?.sendDM.message) {
                // worked
                // router.push("/");
                socket.emit("received");
                resetForm();
              }
            } else if (fileSrc != "") {
              if (file.size > 10485760) {
                // 10 MB
                alert("File is too big!");
              }
              var data = new FormData();
              data.append("image", file);
              data.append("path", "attachments");

              const filename = (
                await (
                  await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/upload`, {
                    method: "POST",
                    // headers: {
                    //     'Accept': 'application/json',
                    //     'Content-Type': 'application/json'
                    // },
                    body: data,
                  })
                ).json()
              ).filename;

              const response = await sendDM({
                variables: {
                  receiverId: parseInt(props.receiverId as string),
                  type: "image",
                  msg: filename,
                },
              });

              if (response.data?.sendDM.errors) {
                console.log(response.data?.sendDM.errors);
                setErrors(toErrorMap(response.data.sendDM.errors));
                // setErrors({ username: "hi" });
              } else if (response.data?.sendDM.message) {
                // worked
                // router.push("/");
                // console.log("worked");
                socket.emit("received");
                resetForm();
                setFile(new File([""], ""));
                setFileSrc("");
              }
            }

            // actions.setSubmitting(false);
          } else if (props.type == "group") {
            if (values.msg != "") {
              const response = await sendInChannel({
                variables: {
                  channelId: parseInt(props.receiverId as string),
                  msg: values.msg,
                  type: "text",
                },
              });
              if (response.data?.sendInChannel.errors) {
                console.log(response.data?.sendInChannel.errors);
                setErrors(toErrorMap(response.data.sendInChannel.errors));
                // setErrors({ username: "hi" });
              } else if (response.data?.sendInChannel.message) {
                // worked
                // router.push("/");
                // console.log("worked");
                socket.emit("received");
                resetForm();
              }
            } else if (fileSrc != "") {
              if (file.size > 10485760) {
                // 10 MB
                alert("File is too big!");
              }
              var data = new FormData();
              data.append("image", file);
              data.append("path", "attachments");

              const filename = (
                await (
                  await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/upload`, {
                    method: "POST",
                    // headers: {
                    //     'Accept': 'application/json',
                    //     'Content-Type': 'application/json'
                    // },
                    body: data,
                  })
                ).json()
              ).filename;

              const response = await sendInChannel({
                variables: {
                  channelId: parseInt(props.receiverId as string),
                  msg: filename,
                  type: "image",
                },
              });

              if (response.data?.sendInChannel.errors) {
                console.log(response.data?.sendInChannel.errors);
                setErrors(toErrorMap(response.data.sendInChannel.errors));
              } else if (response.data?.sendInChannel.message) {
                // worked
                // router.push("/");
                // console.log("worked");
                socket.emit("received");
                resetForm();
                setFile(new File([""], ""));
                setFileSrc("");
              }
            }
          }
        }}
      >
        {({ handleSubmit, isSubmitting, setFieldValue }) => (
          <Form
            onSubmit={handleSubmit}
            className="bg-gray-50 dark:bg-gray-750 py-2 rounded-md"
          >
            {fileSrc && (
              <>
                <div className="mb-3 mx-4">
                  <img
                    src={URL.createObjectURL(file)}
                    className="h-full rounded-md max-h-32"
                  />
                </div>
                <div className="w-full h-px bg-gray-500 mb-3"></div>
              </>
            )}

            {/* <label htmlFor="receiverId">Receiver ID</label>
            <Field type="number" name="receiverId" />
            <ErrorMessage name="receiverId" />
            <br /> */}

            <div className="flex items-center px-4">
              <label
                htmlFor="file"
                className="cursor-pointer text-2xl mr-3 text-gray-800 dark:text-gray-300"
              >
                <i className="fa-solid fa-circle-plus"></i>
              </label>

              <input
                id="file"
                name="file"
                type="file"
                accept="image/*"
                onChange={event => {
                  // handleFileUpload(event);
                  setFile(event.currentTarget.files![0]);
                  setFileSrc(URL.createObjectURL(file));
                }}
                className="hidden"
              />
              {/* <label htmlFor="msg">Message</label> */}
              <Field
                name="msg"
                placeholder="Start typing..."
                className="bg-gray-50 dark:bg-gray-750 outline-none w-full"
                autoFocus
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-100 bg-blue-600 py-2 px-4 rounded-md font-semibold text-sm hover:bg-blue-500"
              >
                Send
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Send;
