import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
// import Image from 'next/image'
import { useLogoutMutation } from "../generated/graphql";

const Home: NextPage = () => {
  const [logout] = useLogoutMutation();

  const handleLogout = async () => {
    const response = await logout();
    if (response.errors) {
      console.log(response.errors);
      // setErrors({ username: "hi" });
    } else if (response.data?.logout) {
      // worked
      // router.push("/");
      console.log("worked");
    }
  };

  return (
    <div>
      <Head>
        <title>Discord Clone</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Link href="/login">
          <a>Log in</a>
        </Link>

        <br />

        <Link href="/register">
          <a>Register</a>
        </Link>

        <br />
        <button onClick={handleLogout}>Log out</button>
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
