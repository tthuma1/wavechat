import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useDeleteGroupMutation,
  useRenameGroupMutation,
} from "../generated/graphql";

const socket = io("http://localhost:4000");

const EditGroupModal: NextPage<{ groupId: number }> = props => {
  const router = useRouter();
  const [deleteStage, setDeleteStage] = useState(0);
  const [renameGroup] = useRenameGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();

  const handleDeleteGroup = async () => {
    if (deleteStage == 0) setDeleteStage(1);
    else {
      const response = await deleteGroup({
        variables: { deleteGroupId: props.groupId },
      });

      if (response.data && response.data?.deleteGroup.errors == null) {
        socket.emit("group deleted");
        // close modal
        let modal = document.getElementById("editGroupModal");
        modal!.classList.remove("flex");
        modal!.classList.add("hidden");

        router.push("/app");
        setDeleteStage(0);
      }
    }
  };

  useEffect(() => {
    let modal = document.getElementById("editGroupModal");
    window.onclick = event => {
      if (event.target == modal) {
        modal!.classList.remove("flex");
        modal!.classList.add("hidden");
        setDeleteStage(0);
      }
    };
  }, []);

  return (
    <div
      id="editGroupModal"
      className="modal hidden fixed z-10 pt-[40vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
    >
      <div className="flex flex-col items-center bg-gray-850 w-1/2 h-fit rounded-md py-3 px-6">
        <div className="flex justify-end w-full">
          <div
            className="w-6 h-6 text-xl text-gray-400 hover:cursor-pointer rounded-full hover:bg-gray-700 flex justify-center items-center"
            onClick={() => {
              let modal = document.getElementById("editGroupModal");

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
            const response = await renameGroup({
              variables: { renameGroupId: props.groupId, newName: values.name },
            });

            if (response.data?.renameGroup.group) {
              socket.emit("group renamed");
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
                id="editGroupInput"
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
                Edit Group Name
              </button>
            </Form>
          )}
        </Formik>

        <div className="flex justify-end w-full">
          <div
            className="mt-2 border-red-700 bg-gray-50 dark:bg-transparent border py-2 px-4 rounded-md text-sm hover:bg-red-700 dark:hover:bg-red-700 hover:cursor-pointer hover:text-gray-100"
            onClick={handleDeleteGroup}
          >
            {deleteStage == 0 && (
              <>
                Delete Group
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

export default EditGroupModal;