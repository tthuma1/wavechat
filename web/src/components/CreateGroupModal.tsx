import { ErrorMessage, Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { useCreateGroupMutation } from "../generated/graphql";
import { socket } from "../utils/socket";
import { toErrorMap } from "../utils/toErrorMap";

const CreateGroupModal: NextPage = props => {
  const router = useRouter();
  const [createGroup] = useCreateGroupMutation();

  return (
    <div
      id="createGroupModal"
      className="modal hidden fixed z-10 pt-[40vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
    >
      <div className="flex flex-col items-center w-1/2 px-6 py-3 bg-gray-200 rounded-md dark:bg-gray-850 h-fit">
        <div className="flex justify-end w-full">
          <div
            className="flex items-center justify-center w-6 h-6 text-xl text-gray-400 rounded-full hover:cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-700"
            onClick={() => {
              let modal = document.getElementById("createGroupModal");

              modal!.classList.remove("flex");
              modal!.classList.add("hidden");
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
            const response = await createGroup({
              variables: { name: values.name },
            });

            if (response.data?.createGroup.errors) {
              setErrors(toErrorMap(response.data.createGroup.errors));
            } else if (response.data?.createGroup) {
              socket.emit("group created");

              // close modal
              let modal = document.getElementById("createGroupModal");
              modal!.classList.remove("flex");
              modal!.classList.add("hidden");

              router.push(
                "/channel/" + response.data.createGroup.firstChannelId
              );

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
                <Field
                  id="createGroupInput"
                  type="name"
                  name="name"
                  placeholder="Group name"
                  className="flex-1 input-settings"
                />

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm text-gray-100 bg-blue-600 rounded-md hover:bg-blue-500"
                >
                  Create Group
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
      </div>
    </div>
  );
};

export default CreateGroupModal;
