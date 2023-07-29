import React, { useEffect, useState, useRef } from "react";
import MessageBox from "./Messages/MessageBox";
import useChat from "../hooks/useChat";
import { useParams } from "react-router-dom";
import useRoom from "../hooks/useRoom";
import Message from "./Messages/Message";
import { Container, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

const ChatRoom = () => {
  const { user_id } = useParams();
  const [room, setRoom] = useState(null);
  const { room: privateRoom } = useRoom(room?._id);
  const { messages, sendMessage } = useChat(room?._id);
  const [username, setUserName] = useState("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const gotoLastMessageRef = useRef(null);

  useEffect(() => {
    const getUserName = async (id) => {
      try {
        const response = await fetch(`http://localhost:8000/api/users/${id}`);
        const result = await response.json();
        setUserName(result.name);
      } catch (error) {
        console.log("Error getting user", error);
      }
    };

    getUserName(user_id);

    const createNewRoom = async () => {
      try {
        const response = await axios.post(`/api/room`, {
        //   method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `Private room`,
            description: "A new room",
            users: [user_id, userInfo._id],
          }),
        });
        const roomData = await response.data;
        if (roomData.status === 409) {
          console.log("Found existing Room:", roomData?.room);
          setRoom(roomData?.room);
        } else {
          setRoom(roomData);
        }
      } catch (error) {
        console.log(error);
      }
    };

    createNewRoom();
  }, [user_id, userInfo._id]);

  useEffect(() => {
    // Scroll to the last message when the messages array changes
    gotoLastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Container fluid>
      <Row>
        {/* Chat Box (on the left) */}
        <Col xs={9}>
          {/* Chat Box Header */}
          <div className="chat-header">
            <h3>
              {privateRoom?.name ?? "Private room"} with{" "}
              <i style={{ color: "green" }}>{username}</i>{" "}
            </h3>
          </div>
          {/* Chat Box Body */}
          <div className="chat-body">
            <ul className="chat-messages">
              {messages? messages?.map((message) => (
                <Message message={message} key={message?._id} />
              )): console.log("MESSAGES: {CHATROOM}",messages)}
              <li ref={gotoLastMessageRef}></li>
            </ul>
          </div>
          {/* Chat Box Footer */}
          <div className="chat-footer">
            <MessageBox onSendMessage={(message) => sendMessage(message)} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatRoom;
