import { ErrorMessage, Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import {
  useDeleteGroupMutation,
  useGetGroupInfoQuery,
  useRenameGroupMutation,
  useToggleGroupVisibilityMutation,
  useGenerateInviteMutation,
} from "../generated/graphql";
import { socket } from "../utils/socket";
import { toErrorMap } from "../utils/toErrorMap";

const EditGroupModal: NextPage<{ groupId: number }> = props => {
  const router = useRouter();
  const [deleteStage, setDeleteStage] = useState(0);
  const [renameGroup] = useRenameGroupMutation();
  const [deleteGroup] = useDeleteGroupMutation();
  const [toggleGroupVisibility] = useToggleGroupVisibilityMutation();
  const [generateInvite] = useGenerateInviteMutation();

  const { data: groupData, loading: groupLoading } = useGetGroupInfoQuery({
    variables: {
      groupId: props.groupId as number,
    },
  });

  const [copied, setCopied] = useState(false);

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

  if (!groupLoading && groupData) {
    setTimeout(() => {
      let modal = document.getElementById("editGroupModal");
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

  const handleToggle = async () => {
    await toggleGroupVisibility({
      variables: { groupId: props.groupId as number },
    });
  };

  const handleInvite = async () => {
    const response = await generateInvite({
      variables: { groupId: props.groupId as number },
    });

    if (response.data?.generateInvite) {
      console.log(response.data?.generateInvite);
      navigator.clipboard.writeText(response.data.generateInvite);

      setCopied(true);

      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (!groupLoading && groupData) {
    return (
      <div
        id="editGroupModal"
        className="modal hidden fixed z-10 pt-[30vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
      >
        <div className="flex flex-col items-center w-1/2 px-6 py-3 bg-gray-200 rounded-md dark:bg-gray-850 h-fit">
          <div className="flex justify-end w-full">
            <div
              className="flex items-center justify-center w-6 h-6 text-xl text-gray-400 rounded-full hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
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
                variables: {
                  renameGroupId: props.groupId,
                  newName: values.name,
                },
              });

              if (response.data?.renameGroup.errors) {
                console.log();
                setErrors(toErrorMap(response.data.renameGroup.errors));
              } else if (response.data?.renameGroup.group) {
                socket.emit("group renamed");
                resetForm();
              }
            }}
          >
            {({ handleSubmit, isSubmitting, errors }) => (
              <>
                <Form
                  onSubmit={handleSubmit}
                  className="flex items-center w-full gap-3 mt-4 mb-2"
                >
                  {/* <label htmlFor="name">Channel name:</label> */}
                  <Field
                    id="editGroupInput"
                    type="name"
                    name="name"
                    placeholder="New group name"
                    className="flex-1 input-settings"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500"
                  >
                    Edit Group Name
                  </button>
                </Form>

                {errors.name && (
                  <div className="flex w-full text-sm text-red-500">
                    <ErrorMessage name="name" />
                  </div>
                )}
              </>
            )}
          </Formik>

          <div className="flex flex-col items-end w-full">
            <div className="btn-danger" onClick={handleDeleteGroup}>
              {deleteStage == 0 && (
                <>
                  Delete Group
                  <i className="ml-3 text-gray-800 fa-solid fa-trash dark:text-gray-300"></i>
                </>
              )}
              {deleteStage == 1 && <>Are you sure?</>}
            </div>
            <div>
              {groupData.getGroupInfo.group?.isPrivate && (
                <button
                  className="mt-2 mr-3 text-sm btn-secondary"
                  disabled={copied}
                  onClick={handleInvite}
                >
                  {!copied ? (
                    <span>Copy Invite Link</span>
                  ) : (
                    <span>Link Copied!</span>
                  )}
                </button>
              )}
              <button
                className="mt-2 text-sm btn-secondary"
                onClick={handleToggle}
              >
                {groupData.getGroupInfo.group?.isPrivate ? (
                  <span>Make Public</span>
                ) : (
                  <span>Make Private</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default EditGroupModal;
