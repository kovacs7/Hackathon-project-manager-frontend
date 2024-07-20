import axios from "axios";
import {
  MessageCircleCode,
  MessageSquareText,
  MessagesSquareIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";
import useAccountData from "../../../store/authStore";
import ChatPrivate from "./ChatPrivate";

const Chat = () => {
  const [projectInfo, setProjectInfo] = useState({});
  const { projectId } = useParams();
  const { data, getAccountData } = useAccountData();
  const [privateChats, setPrivateChats] = useState(false);

  useEffect(() => {
    getAccountData();
  }, [getAccountData]);

  const fetchDataByProjectId = async () => {
    try {
      const res = await axios.get(`/app-dashboard/${projectId}/tasks`);
      setProjectInfo(res.data);

      if (res.data.error) {
        toast.error(res.data.error);
      }
    } catch (error) {
      toast.error("Error occured while fetching data by projectId on client.");
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataByProjectId();
  }, []);

  return (
    <div>
      <h2 className="text-md font-bold font-headerFonts sm:text-xl p-2 text-gray-600 border-b-2 border-gray-300 flex justify-between items-center bg-white">
        <p className="flex items-center gap-2">
          <MessageCircleCode />
          Chat Room For {projectInfo.title}
        </p>
        <button
          className="group relative inline-block text-sm font-medium text-white focus:outline-none"
          onClick={() => setPrivateChats(!privateChats)}
        >
          <span className="absolute inset-0 border-2 border-indigo-500 group-active:border-indigo-600 rounded-lg"></span>
          <span className="block border border-indigo-600 bg-indigo-500 px-1 py-1 transition-transform active:border-indigo-400 active:bg-indigo-400 group-hover:-translate-x-1 group-hover:-translate-y-1 rounded-lg">
            <div className="flex items-center gap-2">
              {privateChats ? (
                <>
                  <MessagesSquareIcon size={16} />
                  <p className="sm:block hidden pr-1">Group Chats</p>
                </>
              ) : (
                <>
                  <MessageSquareText size={16} />
                  <p className="sm:block hidden pr-1">Private Chats</p>
                </>
              )}
            </div>
          </span>
        </button>
      </h2>
      <div>
        {privateChats ? (
          <ChatPrivate
            projectId={projectId}
            userId={data._id}
            username={data.username}
          />
        ) : (
          <ChatRoom
            projectId={projectId}
            userId={data._id}
            username={data.username}
          />
        )}
      </div>
    </div>
  );
};

export default Chat;
