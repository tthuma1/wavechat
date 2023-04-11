import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useDeleteChannelMutation,
  useRenameChannelMutation,
} from "../generated/graphql";

const socket = io(process.env.NEXT_PUBLIC_DOMAIN!);

const EditChannelModal: NextPage<{ channelId: number }> = props => {
  const router = useRouter();
  const [deleteStage, setDeleteStage] = useState(0);
  const [renameChannel] = useRenameChannelMutation();
  const [deleteChannelMut] = useDeleteChannelMutation();

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

  useEffect(() => {
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
  }, []);

  return (
    <div
      id="editChannelModal"
      className="modal hidden fixed z-10 pt-[40vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
    >
      <div className="flex flex-col items-center bg-gray-200 dark:bg-gray-850 w-1/2 h-fit rounded-md py-3 px-6">
        <div className="flex justify-end w-full">
          <div
            className="w-6 h-6 text-xl text-gray-400 hover:cursor-pointer rounded-full hover:bg-gray-300 dark:hover:bg-gray-700 flex justify-center items-center"
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
              className="flex items-center gap-3 w-full mt-4 mb-2"
            >
              {/* <label htmlFor="name">Channel name:</label> */}
              <Field
                id="editInput"
                type="name"
                name="name"
                placeholder="New channel name"
                className="input-settings flex-1"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-100 bg-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-500"
              >
                Edit Channel Name
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-end w-full">
          <div className="mt-2 btn-danger" onClick={deleteChannel}>
            {deleteStage == 0 && (
              <>
                Delete Channel
                <i className="fa-solid fa-trash ml-3 text-gray-800 dark:text-gray-300"></i>
              </>
            )}
            {deleteStage == 1 && <>Are you sure?</>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditChannelModal;
