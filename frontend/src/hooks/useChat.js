/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const useChat = (id) => {
  const socketRef = useRef();
  const [messages, setMessages] = useState([]);
  const navigate = useHistory();
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    const url = `http://localhost:8000/api/message/${id}`;
    const fetchMessages = async (url) => {
      if (!id) {
        setMessages([]);
      } else {
        const token = userInfo.token;
        try {
          const response = await fetch(url, {
            headers: {
              authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          if (data.status === 401) {
            navigate("/login");
          }
          console.log(data);
          setMessages(data);
        } catch (error) {
          console.log("error", error);
        }
      }
    };

    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("newChatMessage", (message) => {
      console.log("IN USECHAT.....",message);
      console.log("IN USECHAT.....",userInfo);
      setMessages((messages) => [...messages, message]);
    });
    fetchMessages(url);
    console.log("MSGS::::", messages);
    return () => {
      socketRef.current.disconnect();
    };
  }, [id]);

  const sendMessage = (message) => {
    socketRef.current.emit("newChatMessage", { ...message, room: id });
  };

  return { messages, sendMessage };
};

export default useChat;
