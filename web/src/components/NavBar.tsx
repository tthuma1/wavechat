import type { NextComponentType } from "next";
import Link from "next/link";
// import Image from 'next/image'
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const NavBar: NextComponentType = () => {
  const [logout] = useLogoutMutation();
  const { data, loading } = useMeQuery();

  const handleLogout = async () => {
    const response = await logout();
    if (response.errors) {
      console.log(response.errors);
      // setErrors({ username: "hi" });
    } else if (response.data?.logout) {
      // worked
      // router.push("/");
      window.location.reload();
      console.log("worked");
    }
  };

  let body = null;

  // data is loading
  if (loading) {
    // user not logged in
  } else if (!data?.me) {
    body = (
      <>
        <Link href="/login">
          <a>Log in</a>
        </Link>

        <Link href="/register">
          <a>Register</a>
        </Link>
      </>
    );
    // user is logged in
  } else {
    body = (
      <>
        <Link href="/send">
          <a>Send</a>
        </Link>
        <div>{data.me.username}</div>
        <button onClick={handleLogout}>Log out</button>
      </>
    );
  }

  return (
    <div style={styles.container}>
      <Link href="/">Home</Link>
      {body}
    </div>
  );
};

const styles = {
  container: {
    margin: "50px auto",
    backgroundColor: "#116611",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
} as const;

export default NavBar;
