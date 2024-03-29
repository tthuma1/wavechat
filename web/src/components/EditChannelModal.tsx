import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useDeleteChannelMutation,
  useRenameChannelMutation,
  useToggleVisibilityMutation,
  useGetChannelInfoQuery,
} from "../generated/graphql";
import Whitelist from "./Whitelist";
import { socket } from "../utils/socket";

const EditChannelModal: NextPage<{ channelId: number }> = props => {
  const router = useRouter();
  const [deleteStage, setDeleteStage] = useState(0);
  const [renameChannel] = useRenameChannelMutation();
  const [deleteChannelMut] = useDeleteChannelMutation();
  const [toggleVisiblity] = useToggleVisibilityMutation();
  const { data: channelData, loading: channelLoading } = useGetChannelInfoQuery(
    { variables: { channelId: props.channelId as number } }
  );

  const deleteChannel = async () => {
    if (deleteStage == 0) setDeleteStage(1);
    else {
      const response = await deleteChannelMut({
        variables: { deleteChannelId: props.channelId },
      });

      if (response.data && response.data?.deleteChannel != -1) {
        socket.emit("channel deleted");
        // close modal
        let modal = document.getElementById("editChannelModal");
        modal!.classList.remove("flex");
        modal!.classList.add("hidden");

        router.push("/channel/" + response.data.deleteChannel);
        setDeleteStage(0);
      }
    }
  };

  const handleToggle = async () => {
    const response = await toggleVisiblity({
      variables: { channelId: props.channelId as number },
    });

    if (response.data?.toggleVisibility.channel) {
      socket.emit("visibility changed");
    }
  };

  if (!channelLoading && channelData) {
    setTimeout(() => {
      let modal = document.getElementById("editChannelModal");
      if (modal) {
        modal.onclick = event => {
          if (event.target == modal) {
            modal!.classList.remove("flex");
            modal!.classList.add("hidden");
            setDeleteStage(0);
          }
        };
      }
    }, 100);
  }

  if (!channelLoading && channelData) {
    return (
      <div
        id="editChannelModal"
        className="modal hidden fixed z-10 pt-[20vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
      >
        <div className="flex flex-col items-center w-1/2 px-6 py-3 bg-gray-200 rounded-md dark:bg-gray-850 h-fit">
          <div className="flex justify-end w-full">
            <div
              className="flex items-center justify-center w-6 h-6 text-xl text-gray-400 rounded-full hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
              onClick={() => {
                let modal = document.getElementById("editChannelModal");

                modal!.classList.remove("flex");
                modal!.classList.add("hidden");
                setDeleteStage(0);
              }}
            >
              <i className="fa-solid fa-xmark"></i>
            </div>
          </div>

          <Formik
            initialValues={{
              name: "",
            }}
            onSubmit={async (values, { setErrors, resetForm }) => {
              const response = await renameChannel({
                variables: { channelId: props.channelId, newName: values.name },
              });

              if (response.data?.renameChannel.channel) {
                socket.emit("channel renamed");
                resetForm();
              }
            }}
          >
            {({ handleSubmit, isSubmitting, setFieldValue }) => (
              <Form
                onSubmit={handleSubmit}
                className="flex items-center w-full gap-3 mt-4 mb-2"
              >
                {/* <label htmlFor="name">Channel name:</label> */}
                <Field
                  id="editInput"
                  type="name"
                  name="name"
                  placeholder="New channel name"
                  className="flex-1 input-settings"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500"
                >
                  Edit Channel Name
                </button>
              </Form>
            )}
          </Formik>

          <div className="flex flex-col items-end w-full">
            <button className="mt-2 btn-danger" onClick={deleteChannel}>
              {deleteStage == 0 && (
                <>
                  Delete Channel
                  <i className="ml-3 text-gray-800 fa-solid fa-trash dark:text-gray-300"></i>
                </>
              )}
              {deleteStage == 1 && <>Are you sure?</>}
            </button>
            <button
              className="mt-2 text-sm btn-secondary"
              onClick={handleToggle}
            >
              {channelData.getChannelInfo.channel?.isPrivate ? (
                <span>Make Public</span>
              ) : (
                <span>Make Private</span>
              )}
            </button>
          </div>

          {channelData.getChannelInfo.channel?.isPrivate && (
            <div className="w-full">
              <div className="w-full h-px mt-4 mb-4 bg-gray-600"></div>
              <div className="mb-2">Allowed users:</div>
              <Whitelist channelId={props.channelId} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default EditChannelModal;
