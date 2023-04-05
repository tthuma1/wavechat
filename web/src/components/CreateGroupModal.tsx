import { Field, Form, Formik } from "formik";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { io } from "socket.io-client";
import { useCreateGroupMutation } from "../generated/graphql";

const socket = io(process.env.NEXT_PUBLIC_DOMAIN!);

const CreateGroupModal: NextPage = props => {
  const router = useRouter();
  const [createGroup] = useCreateGroupMutation();

  return (
    <div
      id="createGroupModal"
      className="modal hidden fixed z-10 pt-[40vh] w-full h-full bg-[rgba(0,0,0,0.6)] justify-center"
    >
      <div className="flex flex-col items-center bg-gray-850 w-1/2 h-fit rounded-md py-3 px-6">
        <div className="flex justify-end w-full">
          <div
            className="w-6 h-6 text-xl text-gray-400 hover:cursor-pointer rounded-full hover:bg-gray-700 flex justify-center items-center"
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

            if (response.data?.createGroup.group) {
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
          {({ handleSubmit, isSubmitting, setFieldValue }) => (
            <Form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 w-full mt-4 mb-2"
            >
              {/* <label htmlFor="name">Channel name:</label> */}
              <Field
                id="createGroupInput"
                type="name"
                name="name"
                placeholder="Group name"
                className="input-settings flex-1"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="text-gray-100 bg-blue-600 py-2 px-4 rounded-md text-sm hover:bg-blue-500"
              >
                Create Group
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateGroupModal;
