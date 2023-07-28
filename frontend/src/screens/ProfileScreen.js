import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col, ListGroup, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import { USER_UPDATE_PROFILE_RESET } from "../constants/userConstants";
import Message from "../components/Message";

const ProfileScreen = ({ history }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);

  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  // useSelector is to grab what we want from the state
  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  // Make sure user is logged in to access this page
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // Get success value from userUpdateProfileReducer
  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  // To get my list of orders

  // make request here upon component load
  useEffect(
    () => {
      if (!userInfo) {
        history.push("/login");
      } else {
        if (!user || !user.name || success) {
          //   dispatch({ type: USER_UPDATE_PROFILE_RESET });
          //   dispatch(getUserDetails("profile"));
        } else {
          setName(user.name);
          setEmail(user.email);
        }
      }
    },
    [dispatch, history, userInfo, user, success] // Dependencies, on change they fire off useEffect
  );

  const submitHandler = (e) => {
    e.preventDefault();
    // Check if passwords match
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }
  };

  return (
    <Row>
      <Col md={3}>
        <h2>User Profile</h2>
        {/* On error, display message/error
            When loading, display Loading... */}
        {message && <Message variant="danger">{message}</Message>}
        {error && <Message variant="danger">{error}</Message>}
        {success && <Message variant="success">Profile Updated</Message>}
        {loading && <Loader />}
        <Message>
          {userInfo.name} ~ {userInfo.email}
        </Message>
        <Form onSubmit={submitHandler} className="push-to-right">
          {/* Name */}
          <Form.Group controlId="email">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Email */}
          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Password */}
          <Form.Group controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Confirm Password */}
          <Form.Group controlId="confirmPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          {/* Button */}
          <Button type="submit" variant="primary">
            Update
          </Button>
        </Form>
      </Col>
      <Col md={8}>
        <h1>Your Requests</h1>
        {cartItems.length === 0 ? (
          <Message>
            Your Request list is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {cartItems.map((item) => (
              <ListGroup.Item key={item.product}>
                <Row>
                  <Col md={2}>
                    <Link to={`/product/${item.product}`}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Link>
                  </Col>
                  <Col md={3}>
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <Link to={`/product/${item.product}`}>
                      {item.product?.owner?.name}
                    </Link>
                  </Col>
                </Row>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
