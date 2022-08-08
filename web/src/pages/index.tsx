import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
// import Image from 'next/image'

const Home: NextPage = () => {
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
      </main>

      <footer></footer>
    </div>
  );
};

export default Home;
