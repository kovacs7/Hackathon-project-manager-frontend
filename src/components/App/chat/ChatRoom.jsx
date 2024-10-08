import { useEffect, useState, useRef } from "react";
import socket from "../../../config/socket";
import PropTypes from "prop-types";
import {
  ArrowUpAZ,
  Calendar,
  Clock,
  MessageSquareMore,
  SendHorizonal,
  UserPlus,
  Users,
} from "lucide-react";

const ChatRoom = ({ projectId, userId, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState(new Map());
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("joinProject", projectId, userId, username);

    socket.on("previousMessages", (messages) => {
      setMessages(messages);
    });

    socket.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("typing", ({ userId, username }) => {
      setTypingUsers((prevUsers) => new Map(prevUsers).set(userId, username));
    });

    socket.on("stopTyping", (userId) => {
      setTypingUsers((prevUsers) => {
        const newUsers = new Map(prevUsers);
        newUsers.delete(userId);
        return newUsers;
      });
    });

    return () => {
      socket.off("previousMessages");
      socket.off("message");
      socket.off("onlineUsers");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [projectId, userId, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const messageData = {
      projectId,
      sender: userId,
      senderUsername: username,
      message: newMessage,
      timestamp: new Date().toISOString(),
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  const handleTyping = () => {
    socket.emit("typing", projectId, userId, username);
    setTimeout(() => {
      socket.emit("stopTyping", projectId, userId);
    }, 4000); // timing of user inactivity
  };

  function capitalizeFirstLetter(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function convertTo12HourFormat(timestamp) {
    const date = new Date(timestamp);

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutesStr = minutes < 10 ? "0" + minutes : minutes;
    const strTime = hours + ":" + minutesStr + " " + ampm;
    return strTime;
  }

  const formatDate = (timestamp) => {
    const dateObj = new Date(timestamp);
    const options = { day: "numeric", month: "short", year: "numeric" };
    const formattedDate = dateObj
      .toLocaleDateString("en-US", options)
      .toUpperCase();
    return formattedDate;
  };

  return (
    <div className="flex flex-wrap p-4 md:space-x-4 h-[90%]">
      {/* Online & typing users section */}
      <div className="bg-white shadow-md rounded-md p-4 w-[18%] md:block hidden">
        <div className="mb-4 border-b border-slate-300 pb-4 h-1/2">
          <div className="font-semibold text-sm flex flex-row gap-1 items-center justify-center p-1 bg-emerald-100 border border-emerald-300 rounded-md text-emerald-800">
            <Users size={16} />
            <p>Online Users</p>
          </div>
          <div className="overflow-y-auto">
            <ul>
              {onlineUsers.map((user, index) =>
                user.username ? (
                  <li
                    key={index}
                    className="font-medium text-sm flex flex-row gap-1 items-center justify-center w-full odd:bg-blue-50 even:bg-slate-50 border p-1 my-1 rounded-md text-gray-600 odd:border-blue-300 even:border-slate-300 odd:hover:bg-white even:hover:bg-white"
                  >
                    <UserPlus size={16} />
                    <p>{user.username}</p>
                  </li>
                ) : null
              )}
            </ul>
          </div>
        </div>
        <div>
          <h3 className="font-semibold text-sm flex flex-row gap-1 items-center justify-center p-1 bg-blue-100 border border-blue-300 rounded-md text-blue-700">
            <ArrowUpAZ size={16} />
            <p>Typing Users ...</p>
          </h3>
          <ul>
            {Array.from(typingUsers.values()).map((username, index) => (
              <li
                key={index}
                className="font-medium text-sm flex flex-row gap-1 items-center justify-center w-full odd:bg-purple-50 even:bg-slate-50 p-1 my-1 rounded-md odd:text-purple-600 even:text-slate-600 border odd:border-purple-300 even:border-slate-300"
              >
                <MessageSquareMore size={16} />
                <p>{username}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Message section */}
      <div className="bg-indigo-100 rounded-md p-4 md:w-[79%] w-full flex flex-col gap-4 max-h-custom shadow-md">
        <div className="overflow-y-auto h-custom bg-white shadow-md rounded-md px-4">
          <div className="messages pt-2">
            {messages.map((message, index) => (
              <div
                key={index}
                className="mb-2 odd:bg-indigo-100 even:bg-slate-100 py-1.5 px-2.5 rounded-md"
              >
                <div className="text-md mb-2">
                  <strong className="text-gray-700">
                    {capitalizeFirstLetter(message.senderUsername)}
                  </strong>
                  : {message.message}
                </div>

                {/* timestamp */}

                <div className="text-xs text-purple-700 bg-purple-100 w-fit justify-center flex flex-row gap-2 items-center rounded-md p-0.5 border border-purple-300">
                  <div className="flex flex-row gap-1 items-center">
                    <Calendar size={13} />
                    <p>{formatDate(message.timestamp)}</p>
                  </div>

                  <div className="flex flex-row gap-1 items-center">
                    <Clock size={13} />
                    <p>{convertTo12HourFormat(message.timestamp)}</p>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        <form
          className="flex flex-row bg-white rounded-md p-1.5 shadow-md"
          onSubmit={handleSendMessage}
        >
          <input
            type="text"
            className="px-2.5 py-1.5 rounded-md w-full outline-none border border-indigo-300"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
              handleTyping();
            }}
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="text-white bg-indigo-500 px-2.5 py-1.5 ml-4 rounded-md flex flex-row gap-1 items-center"
          >
            <p>Send</p>
            <SendHorizonal size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;

ChatRoom.propTypes = {
  projectId: PropTypes.string.isRequired,
  userId: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
};
