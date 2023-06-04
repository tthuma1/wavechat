import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  useMeQuery,
  useChangeEmailMutation,
  useChangePasswordMutation,
  useChangeAvatarMutation,
  useChangeUsernameMutation,
} from "../generated/graphql";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import { NextPage } from "next";
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { toErrorMap } from "../utils/toErrorMap";
import AWS from "aws-sdk";

const Settings: NextPage = () => {
  const router = useRouter();
  const { data: meData, loading: meLoading } = useMeQuery();
  const [changeUsername] = useChangeUsernameMutation();
  const [changeEmail] = useChangeEmailMutation();
  const [changePassword] = useChangePasswordMutation();
  const [changeAvatar] = useChangeAvatarMutation();
  const [file, setFile] = useState<File>();
  const [fileSrc, setFileSrc] = useState("");
  const [saved, setSaved] = useState(false);
  const [currTheme, setCurrtheme] = useState("");

  // quick hack because File is undefined on SSR
  // React.useEffect(() => setFile(new File([""], "")), []);

  useEffect(() => {
    setCurrtheme(localStorage.theme);
  });

  let allLoaded = false;

  if (!meLoading && meData!.me != null) {
    allLoaded = true;
  }

  useEffect(() => {
    if (!meLoading && meData?.me == null) {
      router.push("/login");
    }
  });

  const changeTheme = () => {
    if (localStorage.theme === "dark") {
      localStorage.theme = "light";
      document.getElementById("main")!.classList.remove("dark");
    } else {
      localStorage.theme = "dark";
      document.getElementById("main")!.classList.add("dark");
    }

    setCurrtheme(localStorage.theme);
  };

  if (allLoaded) {
    return (
      <div className="flex justify-center">
        <Head>
          <title>WaveChat - Settings</title>
          <meta name="description" content="" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="flex flex-col items-center pt-10">
          <div className="flex w-full">
            <div className="flex justify-start flex-1">
              <div className="flex items-center justify-center w-10 h-10 text-center text-gray-800 rounded-md bg-gray-150 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700">
                <Link href="/app">
                  <a>
                    <i className="p-4 text-lg fa-solid fa-arrow-left"></i>
                  </a>
                </Link>
              </div>
            </div>
            <h2 className="mb-10 text-4xl font-semibold">Settings</h2>
            <div className="flex-1"></div>
          </div>
          <Formik
            initialValues={{
              email: "",
              oldPassword: "",
              newPassword: "",
              newUsername: "",
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              if (values.newUsername) {
                const response = await changeUsername({
                  variables: {
                    newUsername: values.newUsername,
                  },
                });
                if (response.data?.changeUsername.errors) {
                  console.log(response.data?.changeUsername.errors);
                  console.log(toErrorMap(response.data.changeUsername.errors));
                  setErrors(toErrorMap(response.data.changeUsername.errors));
                } else {
                  resetForm();
                  setSaved(true);
                }
              }

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
                if (file.size > 10485760) {
                  // 10 MB
                  alert("File is too big!");
                }
                let data = new FormData();
                data.append("image", file);
                data.append("path", "avatars");

                const filename = (
                  await (
                    await fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/upload`, {
                      method: "POST",
                      credentials: "include",
                      // headers: {
                      //     'Accept': 'application/json',
                      //     'Content-Type': 'application/json'
                      // },
                      body: data,
                    })
                  ).json()
                ).filename;

                const response = await changeAvatar({
                  variables: { filename },
                });

                if (response.data?.changeAvatar.errors) {
                  console.log(response.data?.changeAvatar.errors);
                  setErrors(toErrorMap(response.data.changeAvatar.errors));
                } else {
                  resetForm();
                  // setFile(new File([""], ""));
                  // setFileSrc("");
                  setSaved(true);
                }
              }
            }}
          >
            {({ handleSubmit, isSubmitting }) => (
              <Form
                onSubmit={handleSubmit}
                className="bg-gray-200 dark:bg-gray-850 rounded-md w-[70vw] px-14 py-10 shadow-md"
              >
                <div className="flex mt-3">
                  <img
                    src={
                      file
                        ? URL.createObjectURL(file)
                        : "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
                          meData?.me?.avatar
                    }
                    className="object-cover w-20 h-20 mr-3 rounded-full"
                  />
                  <label htmlFor="file" className="p-2 mr-3 cursor-pointer">
                    <div className="px-4 py-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500">
                      {/* <i className="pr-2 text-gray-300 fa-solid fa-circle-plus"></i> */}
                      Change avatar
                    </div>
                  </label>

                  <div className="flex justify-between flex-1">
                    <div className="px-4 py-2 m-2 text-sm border-2 border-red-700 rounded-md bg-gray-50 dark:bg-transparent hover:bg-red-700 dark:hover:bg-red-700 hover:cursor-pointer h-fit hover:text-gray-100">
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
                  <div
                    className="flex items-center justify-center w-10 h-10 text-center text-gray-800 rounded-md bg-gray-50 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700 hover:cursor-pointer"
                    onClick={changeTheme}
                  >
                    <a>
                      {currTheme == "dark" ? (
                        // <i className="p-4 text-lg fa-solid fa-sun"></i>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="hidden w-6 h-6 dark:block"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                          ></path>
                        </svg>
                      ) : (
                        <i className="p-4 text-lg fa-regular fa-moon"></i>
                      )}
                    </a>
                  </div>
                </div>

                <br />
                <label htmlFor="newUsername">Change username:</label>
                <br />
                <Field
                  name="newUsername"
                  placeholder="New username"
                  className="mt-4 mb-2 input-settings-light dark:input-settings w-[30rem]"
                />
                <span className="ml-3 text-sm text-red-600">
                  <ErrorMessage name="newUsername" />
                </span>

                <br className="mb-7" />
                <label htmlFor="email">Change email:</label>
                <br />
                <Field
                  type="email"
                  name="email"
                  placeholder="New email"
                  className="mt-4 mb-2 input-settings-light dark:input-settings w-[30rem]"
                />
                <ErrorMessage name="email" />

                <br className="mb-7" />
                <label htmlFor="oldPassword">Change password:</label>
                <br />
                <Field
                  type="password"
                  name="oldPassword"
                  placeholder="Old password"
                  className="mt-4 input-settings-light dark:input-settings w-[30rem]"
                />
                <ErrorMessage name="oldPassword" />

                <br />
                <Field
                  type="password"
                  name="newPassword"
                  placeholder="New password"
                  className="mt-4 mb-7 input-settings-light dark:input-settings w-[30rem]"
                />
                <ErrorMessage name="newPassword" />

                <br />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-semibold text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500 disabled:text-gray-300"
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
