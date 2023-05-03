import { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useMeQuery } from "../generated/graphql";
import { useRouter } from "next/router";

const Landing: NextPage = () => {
  const router = useRouter();
  const { data, loading, refetch } = useMeQuery();

  if (!loading && data?.me) router.push("/app");

  return (
    <div className="flex items-center flex-col px-40 text-center">
      <Head>
        <title>WaveChat</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 className="text-6xl font-semibold mt-48">Welcome to WaveChat</h1>
      <div className="mt-8 text-xl">Start chatting now!</div>
      <div className="mt-10 w-full grid gap-x-20 grid-cols-2 grid-rows-1">
        <Link href="/register">
          <a className="ml-auto w-40 bg-blue-700 p-4 text-lg rounded-lg font-medium hover:bg-blue-600 cursor-pointer text-gray-100">
            Register
          </a>
        </Link>
        <Link href="/login">
          <a className="mr-auto w-40 p-4 text-lg rounded-lg font-medium border-2 border-violet-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:border-violet-600 cursor-pointer">
            Log In
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
