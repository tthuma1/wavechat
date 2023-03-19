import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import FriendList from "../components/FriendList";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";

const App: NextPage = () => {
  const router = useRouter();
  const { data, loading } = useMeQuery();

  const [logout] = useLogoutMutation();

  if (!loading && !data?.me) router.push("/login");

  const handleLogout = async () => {
    const response = await logout();

    if (response.data?.logout) {
      router.push("/login");
    }
  };

  if (!loading)
    return (
      // <div className="w-screen h-screen flex justify-center">
      <div className="pt-10 flex flex-col items-center">
        <div className="flex w-[80vw]">
          <div className="flex-1"></div>
          <p className="text-2xl text-center mb-10">Start chatting!</p>
          <div className="flex-1 flex justify-end">
            <div className="h-10 w-10 bg-gray-800 rounded-md flex justify-center items-center text-gray-300 text-center hover:bg-gray-700 hover:cursor-pointer">
              <Link href="/settings">
                <i className="fa-solid fa-gear p-4 text-lg"></i>
              </Link>
            </div>
            <div className="ml-3 h-10 w-10 bg-gray-800 rounded-md flex justify-center items-center text-gray-300 text-center hover:bg-gray-700 hover:cursor-pointer">
              <button onClick={handleLogout}>
                <i className="fa-solid fa-person-walking-arrow-right p-4 text-lg"></i>
              </button>
            </div>
          </div>
        </div>

        <FriendList type={1} />
      </div>
      // </div>
    );
  else return <div>Loading...</div>;
};

export default App;
