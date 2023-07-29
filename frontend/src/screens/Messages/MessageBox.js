import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';

//renaming prop for use in the component
const MessageBox = (props) => {
  const [initialMessage] = useState({
    sender: "",
    avatar: "",
    body: "",
  });
  const [message, setMessage] = useState(initialMessage);
  const messageRef = useRef("");
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const sendMessageClick = (e) => {
    e.preventDefault();
    if (messageRef.current.value === "") {
      return false;
    }
    if (e.key === "Enter") {
      props.onSendMessage(message);
      setMessage(initialMessage);
      return;
    }

    props.onSendMessage(message);
    setMessage('');
  };
  const handleMessageChange = (e) => {
    setMessage({
      sender: userInfo._id ?? "anonymous",
      avatar: "",
      body: messageRef.current.value ?? "Body not defined",
    });
    console.log("In MessageBox", message)
  };
  const sendMessageOnKeyDown = (e) => {
    if (e.key === "Enter") {
      props.onSendMessage(message);
      setMessage('');
      return;
    }
  };
  return (
        <Form onSubmit={sendMessageClick}>
          <Form.Row>
            <Col xs={9}>
              <Form.Control
                ref={messageRef}
                onChange={handleMessageChange}
                value={message.body}
                onKeyDown={sendMessageOnKeyDown}
                type="text"
                placeholder="Type your message..."
              />
            </Col>
            <Col xs={3}>
              <Button variant="primary" type="submit">
                Send
              </Button>
            </Col>
          </Form.Row>
        </Form>
  );
};

export default MessageBox;
