import { NextPage } from "next";
import Link from "next/link";

const Landing: NextPage = () => {
  return (
    <div className="flex items-center flex-col px-40 text-center">
      <h1 className="text-6xl font-semibold mt-48">Welcome to WaveChat</h1>
      <div className="mt-8 text-xl">Start chatting now!</div>
      <div className="mt-10 w-full grid gap-x-20 grid-cols-2 grid-rows-1">
        <Link href="/register">
          <a className="ml-auto w-40 bg-blue-600 p-4 text-lg rounded-lg font-medium hover:bg-blue-700 cursor-pointer">
            Register
          </a>
        </Link>
        <Link href="/login">
          <a className="mr-auto w-40 p-4 text-lg rounded-lg font-medium border-2 border-violet-500 hover:bg-gray-800 hover:border-violet-600 cursor-pointer">
            Log In
          </a>
        </Link>
      </div>
    </div>
  );
};

export default Landing;
