import React from "react";
import MessageBox from "./Messages/MessageBox";
import Messages from "./Messages/Messages";
import useChat from "../hooks/useChat";
import { useHistory, useParams, Link } from "react-router-dom";
import Rooms from "./room/Rooms";
import useRoom from "../hooks/useRoom";
import Message from "./Messages/Message";
import { Container, Row, Col, ListGroup, Form, Button } from "react-bootstrap";
import { useSelector } from "react-redux";

const Chat = () => {
  const navigate = useHistory();
  const newRoomRef = React.useRef("");
  const { roomId } = useParams();
  console.log("Room ID:", roomId);
  const { room, rooms } = useRoom(roomId);
  const { messages, sendMessage } = useChat(roomId);
  const gotoLastMessageRef = React.useRef(null);
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  React.useEffect(() => {
    gotoLastMessageRef.current.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const createNewRoom = (e) => {
    e.preventDefault()
    const url = `/api/room`
    fetch(url, {
      method: 'post',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: newRoomRef.current.value,
        description: "A new room",
        users: [roomId, userInfo._id]
      })
    })
    .then(res=>res.json())
    .then(room=>{
      newRoomRef.current.value = ''
      window.location.reload()
    })
    .catch(err=>console.log(err))
  }

  return (
    <Container fluid>
      <Row>
        {/* List of Rooms (on the right) */}
        <Col xs={3}>
          <div className="chat-header">
            <h3>Chat Rooms</h3>
          </div>
          <ListGroup>
            {rooms.map((_room, _) => (
              <ListGroup.Item key={_room._idx}>
                <Link to={`/room/${_room._id}`}>{_room.name}</Link>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        {/* Chat Box (on the left) */}
        <Col xs={9}>
          {/* Chat Box Header */}
          <div className="chat-header">
            <h3>{room.name ?? "Chat room"} </h3>
          </div>
          {/* Chat Box Body */}
          <div className="chat-body">
            <ul className="chat-messages">
              {messages.map((message, idx) => (
                <Message message={message} key={message._id} />
              ))}
              <li ref={gotoLastMessageRef}></li>
            </ul>
          </div>
          <div className="chat-footer">
            <MessageBox onSendMessage={(message) => sendMessage(message)} />
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;
