import Link from "next/link";
import router from "next/router";
import {
  useGetWhitelistQuery,
  useMeQuery,
  useRemoveUserFromWhitelistMutation,
  useAddUserToWhitelistMutation,
} from "../generated/graphql";
import { socket } from "../utils/socket";
import { useEffect } from "react";
import { Field, Form, Formik } from "formik";
import { NextPage } from "next";

const Whitelist: NextPage<{ channelId: number | undefined }> = props => {
  const { data: meData, loading: meLoading } = useMeQuery();
  const {
    data: usersData,
    loading: usersLoading,
    refetch: refetchUsers,
  } = useGetWhitelistQuery({
    variables: { channelId: props.channelId as number },
  });

  const [removeUserFromWhitelist] = useRemoveUserFromWhitelistMutation();
  const [addUserToWhitelist] = useAddUserToWhitelistMutation();

  let users: any = [];

  const handleRemove = async (username: string) => {
    const response = await removeUserFromWhitelist({
      variables: {
        channelId: props.channelId as number,
        username,
      },
    });

    if (!response.data?.removeUserFromWhitelist.errors) {
      socket.emit("removed from whitelist");
    }
  };

  socket.on("added to whitelist", () => {
    refetchUsers();
  });

  socket.on("removed from whitelist", () => {
    refetchUsers();
  });

  if (
    !meLoading &&
    meData?.me &&
    !usersLoading &&
    usersData?.getWhitelist.users
  ) {
    for (const user of usersData.getWhitelist.users) {
      users.push(
        <div
          key={user.id}
          className="flex items-center bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-md h-fit"
        >
          <img
            src={
              "https://s3.eu-central-2.wasabisys.com/wavechat/avatars/" +
              user.avatar
            }
            className="w-8 h-8 inline rounded-full mr-4"
          />
          <span className="flex items-center w-full justify-between">
            <span className="overflow-hidden text-ellipsis">
              {user.username}
            </span>
            <button
              className="border-red-700 bg-gray-50 dark:bg-transparent border-2 py-1 px-2 rounded-md text-sm hover:bg-red-700 dark:hover:bg-red-700 hover:cursor-pointer hover:text-gray-100"
              onClick={() => handleRemove(user.username)}
            >
              Remove
            </button>
          </span>
        </div>
      );
    }
  }

  return (
    <div>
      <Formik
        initialValues={{
          username: "",
        }}
        onSubmit={async (values, { setErrors, resetForm }) => {
          const response = await addUserToWhitelist({
            variables: {
              channelId: props.channelId as number,
              username: values.username,
            },
          });

          if (!response.data?.addUserToWhitelist.errors) {
            socket.emit("added to whitelist");
            resetForm();
          }
        }}
      >
        {({ handleSubmit, isSubmitting }) => (
          <Form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 w-full mt-4 mb-2"
          >
            <Field
              id="editInput"
              type="text"
              name="username"
              placeholder="Add user"
              className="input-settings flex-1"
            />

            <button
              type="submit"
              disabled={isSubmitting}
              className="text-gray-100 bg-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-500"
            >
              Add User
            </button>
          </Form>
        )}
      </Formik>

      <div className="grid gap-2 grid-cols-2 max-h-60 overflow-y-scroll scrollbar-colored">
        {users}
      </div>
    </div>
  );
};

export default Whitelist;
