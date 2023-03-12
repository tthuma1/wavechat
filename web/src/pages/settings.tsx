import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  useMeQuery,
  useChangeEmailMutation,
  useChangePasswordMutation,
  useChangeAvatarMutation,
} from "../generated/graphql";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toErrorMap } from "../utils/toErrorMap";
import AWS from "aws-sdk";

const Settings: NextPage = () => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const [changeEmail] = useChangeEmailMutation();
  const [changePassword] = useChangePasswordMutation();
  const [changeAvatar] = useChangeAvatarMutation();
  const [file, setFile] = useState<File>();
  const [fileSrc, setFileSrc] = useState("");
  const [saved, setSaved] = useState(false);

  // quick hack because File is undefined on SSR
  // React.useEffect(() => setFile(new File([""], "")), []);

  let allLoaded = false;

  if (!meLoading && meData!.me != null) {
    allLoaded = true;
  }

  if (!meLoading && meData?.me == null) {
    Router.push("/login");
  }

  if (allLoaded) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>{}</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="pt-20 flex flex-col items-center">
          <h2 className="text-4xl font-semibold mb-10">Settings</h2>
          <Formik
            initialValues={{
              email: "",
              oldPassword: "",
              newPassword: "",
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              if (values.email) {
                const response = await changeEmail({
                  variables: {
                    newEmail: values.email,
                  },
                });
                if (response.data?.changeEmail.errors) {
                  console.log(response.data?.changeEmail.errors);
                  setErrors(toErrorMap(response.data.changeEmail.errors));
                } else {
                  resetForm();
                  setSaved(true);
                }
              }

              if (values.newPassword && values.oldPassword) {
                console.log("aa");
                const response = await changePassword({
                  variables: {
                    oldPassword: values.oldPassword,
                    newPassword: values.newPassword,
                  },
                });
                if (response.data?.changePassword.errors) {
                  console.log(response.data?.changePassword.errors);
                  setErrors(toErrorMap(response.data.changePassword.errors));
                } else {
                  resetForm();
                  setSaved(true);
                }
              }

              if (fileSrc && file) {
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
                    Key: "avatars/" + filename,
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
                    console.log(
                      "UPLOAD ERROR: " + JSON.stringify(err, null, 2)
                    );
                  } else {
                    console.log("Good upload");

                    const response = await changeAvatar({
                      variables: { filename },
                    });

                    if (response.data?.changeAvatar.errors) {
                      console.log(response.data?.changeAvatar.errors);
                      setErrors(toErrorMap(response.data.changeAvatar.errors));
                    } else {
                      resetForm();
                      setFile(new File([""], ""));
                      setFileSrc("");
                      setSaved(true);
                    }
                  }
                });
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form
                onSubmit={handleSubmit}
                className="bg-gray-850 rounded-md w-[70vw] px-14 py-10"
              >
                <div className="flex mt-3">
                  <img
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                          meData?.me?.avatar
                    }
                    className="h-20 w-20 object-cover rounded-full mr-3"
                  />
                  <label htmlFor="file" className="cursor-pointer mr-3 p-2">
                    <div className="bg-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-500">
                      {/* <i className="fa-solid fa-circle-plus text-gray-300 pr-2"></i> */}
                      Change avatar
                    </div>
                  </label>
                  <div className="border-red-700 border py-2 px-4 rounded-md text-sm hover:bg-red-700 hover:cursor-pointer m-2 h-fit">
                    Remove avatar
                  </div>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept="image/*"
                    onChange={event => {
                      // handleFileUpload(event);
                      setFile(event.currentTarget.files![0]);
                      setFileSrc(
                        URL.createObjectURL(event.currentTarget.files![0])
                      );
                    }}
                    className="hidden"
                  />
                </div>

                <br />
                <label htmlFor="email">Change email:</label>
                <br />
                <Field
                  type="email"
                  name="email"
                  placeholder="New email"
                  className="mt-4 mb-2 input-settings w-[30rem]"
                />
                <ErrorMessage name="email" />

                <br className="mb-7" />
                <label htmlFor="oldPassword">Change password:</label>
                <br />
                <Field
                  type="password"
                  name="oldPassword"
                  placeholder="Old password"
                  className="mt-4 input-settings w-[30rem]"
                />
                <ErrorMessage name="oldPassword" />

                <br />
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  className="mt-4 mb-7 input-settings w-[30rem]"
                />
                <ErrorMessage name="newPassword" />

                <br />

                <br />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 py-2 px-4 rounded-md font-semibold text-sm hover:bg-blue-500 disabled:text-gray-300"
                >
                  Save
                </button>
                {saved && <div className="mt-3">Saved!</div>}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Settings;
