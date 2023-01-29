import { NextPage } from "next";
import FriendList from "../components/FriendList";

const App: NextPage = () => {
  return (
    <div className="w-screen h-screen flex justify-center">
      <div className="mt-20">
        <p className="text-2xl text-center mb-10">Start chatting!</p>
        <FriendList />
      </div>
    </div>
  );
};

export default App;
