import io from "socket.io-client";

const socket = io("https://hackathon-project-manager-backend.onrender.com", {
  withCredentials: true,
});

export default socket;
