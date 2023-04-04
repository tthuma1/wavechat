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
import { useState } from "react";
import AWS from "aws-sdk";

const socket = io("http://localhost:4000");

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
          receiverId: parseInt(props.receiverId as string),
          msg: "",
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          if (props.type == "dm") {
            if (values.msg != "") {
              const response = await sendDM({
                variables: { ...values, type: "text" },
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

              const filename = (
                await (
                  await fetch("http://localhost:4000/upload", {
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
                variables: { ...values, type: "image", msg: filename },
              });

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
                setFile(new File([""], ""));
                setFileSrc("");
              }

              //
              //
              //
              //

              /*
              const s3 = new AWS.S3({
                correctClockSkew: true,
                endpoint: "https://s3.eu-central-2.wasabisys.com", //use appropriate endpoint as per region of the bucket
                accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
                secretAccessKey: process.env.NEXT_PUBLIC_SECRET_ACCESS_KEY,
                region: "eu-central-2",
                logger: console,
              });
              const filename = new Date().getTime() + "_" + file.name;
              const uploadRequest = new AWS.S3.ManagedUpload({
                params: {
                  Bucket: "wavechat",
                  Key: "attachments/" + filename,
                  Body: file,
                  ACL: "public-read",
                },
                service: s3,
              });
              uploadRequest.on("httpUploadProgress", function (event) {
                const progressPercentage = Math.floor(
                  (event.loaded * 100) / event.total
                );
                console.log("Upload progress " + progressPercentage);
              });

              console.log("Configed and sending");

              uploadRequest.send(async err => {
                if (err) {
                  console.log("UPLOAD ERROR: " + JSON.stringify(err, null, 2));
                } else {
                  console.log("Good upload");

                  const response = await sendDM({
                    variables: { ...values, type: "image", msg: filename },
                  });

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
                    setFile(new File([""], ""));
                    setFileSrc("");
                  }
                }
              });
*/
              //
              //
              //
              //
            }

            // actions.setSubmitting(false);
          } else if (props.type == "group") {
            const response = await sendInChannel({
              variables: {
                channelId: values.receiverId,
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
              console.log("worked");
              socket.emit("received");
              resetForm();
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
