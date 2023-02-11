import { NextPage } from "next";
import FriendList from "../components/FriendList";

const App: NextPage = () => {
  return (
    // <div className="w-screen h-screen flex justify-center">
    <div className="pt-20">
      <p className="text-2xl text-center mb-10">Start chatting!</p>
      <FriendList type={1} />
    </div>
    // </div>
  );
};

export default App;
