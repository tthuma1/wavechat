import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  let returnValue = [];

  if (
    typeof options.email !== "undefined" &&
    options.email !== "" &&
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(options.email)
  ) {
    returnValue.push({
      field: "email",
      message: "Invalid email.",
    });
  }

  if (options.username.length <= 2) {
    returnValue.push({
      field: "username",
      message: "Length must be greater than 2.",
    });
  }

  if (options.username.includes("@")) {
    returnValue.push({
      field: "username",
      message: "Username cannot include an @",
    });
  }

  if (options.password.length <= 2) {
    returnValue.push({
      field: "password",
      message: "Length must be greater than 2.",
    });
  }

  if (returnValue.length !== 0) return returnValue;
  return null;
};
