import React from "react";
import { useSelector } from "react-redux";

function Message({ message }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const current = userInfo._id;

  return (
    <li
      className={`chat-message ${
        message.sender !== current ? "sender" : "receiver"
      }`}
    >
      {message?.body ?? ""}
    </li>
  );
}

export default Message;
