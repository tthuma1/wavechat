import { NextPage } from "next";
import Link from "next/link";
import FriendList from "../components/FriendList";

const App: NextPage = () => {
  return (
    // <div className="w-screen h-screen flex justify-center">
    <div className="pt-10">
      <div className="flex mx-10">
        <div className="flex-1"></div>
        <p className="text-2xl text-center mb-10">Start chatting!</p>
        <div className="flex-1 flex justify-end">
          <div className="h-10 w-10 bg-gray-800 rounded-md flex justify-center items-center text-gray-300 text-center hover:bg-gray-700">
            <Link href="/settings">
              <a>
                <i className="fa-solid fa-gear p-4 text-lg"></i>
              </a>
            </Link>
          </div>
        </div>
      </div>

      <FriendList type={1} />
    </div>
    // </div>
  );
};

export default App;
