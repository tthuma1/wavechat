import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  let returnValue = [];
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (
    options.email &&
    options.email !== "" &&
    !emailRegex.test(options.email)
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

export const validateEmail = (email: string) => {
  let returnValue = [];
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

  if (email && email !== "" && !emailRegex.test(email)) {
    returnValue.push({
      field: "email",
      message: "Invalid email.",
    });
  }

  if (returnValue.length !== 0) return returnValue;
  return null;
};
