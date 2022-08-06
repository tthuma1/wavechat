import { UsernamePasswordInput } from "../resolvers/UsernamePasswordInput";

export const validateRegister = (options: UsernamePasswordInput) => {
  if (typeof options.email !== "undefined" && !options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Invalid email.",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username cannot include an @",
      },
    ];
  }

  if (options.password.length <= 2) {
    return [
      {
        field: "password",
        message: "Length must be greater than 2.",
      },
    ];
  }

  return null;
};
