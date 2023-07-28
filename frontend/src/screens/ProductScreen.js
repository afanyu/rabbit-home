import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  Image,
  ListGroup,
  Card,
  Button,
  Form,
} from "react-bootstrap";
import Rating from "../components/Rating";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import FormContainer from "../components/FormContainer";
import {
  listProductDetails,
  createProductReview,
} from "../actions/productActions";
import { PRODUCT_CREATE_REVIEW_RESET } from "../constants/productConstants";

const ProductScreen = ({ history, match }) => {
  const [qty, setQty] = useState(1);

  // Product review states
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [message, setMessage] = useState(null);
  const [breed, setBreed] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  // useSelector is to grab what we want from the state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  // Make sure user is logged in
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // For product review
  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const {
    success: successProductReview,
    loading: loadingProductReview,
    error: errorProductReview,
  } = productReviewCreate;

  // make request here upon component load
  useEffect(
    () => {
      if (successProductReview) {
        setRating(0);
        setComment("");
        dispatch(listProductDetails(match.params.id));
        dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      }
      // Fire off action to get a single product
      if (!product?._id || product?._id !== match.params.id) {
        dispatch(listProductDetails(match.params.id));
        dispatch({ type: PRODUCT_CREATE_REVIEW_RESET });
      }
    },
    [dispatch, match, successProductReview, product?._id] // Dependencies, on change they fire off useEffect
  );

  // Add to cart handler
  const addToCartHandler = () => {
    // Redirect to cart and include quantity/qty
    history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProductReview(match.params.id, {
        breed,
        name,
        email,
      })
    );
	addToCartHandler()
  };

  return (
    <>
      {/* Back button */}
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            {/* Product image */}
            <Col md="6">
              <Image
                className="block"
                src={product.image}
                alt={product.name}
                fluid
              />
              <div>
                <h1>Enter Your rabbit details</h1>
                {/* 
            On error, display message/error
            When loading, display Loading... */}
                {message && <Message variant="danger">{message}</Message>}
                {error && <Message variant="danger">{error}</Message>}
                {loading && <Loader />}
                <Form onSubmit={submitHandler}>
                  {/* Name */}
                  <Form.Group controlId="breed">
                    <Form.Label>Breed</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter name"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  {/* Email */}
                  <Form.Group controlId="email">
                    <Form.Label>Your Address</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  <Form.Group controlId="name">
                    <Form.Label>Your Name</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    ></Form.Control>
                  </Form.Group>
                  {/* Button */}
                  <Button type="submit" variant="primary">
                    Send request
                  </Button>
                </Form>
              </div>
            </Col>
            <Col md="3">
              {/* Product name */}
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h3>{product.name}</h3>
                </ListGroup.Item>
                {/* Product rating */}
                <ListGroup.Item>
                  <h6>Owner: {product.owner?.name}</h6>
                  <h6>Contact: {product.owner?.contact}</h6>
                </ListGroup.Item>

                {/* Product price */}
                {/* Product description */}
                <ListGroup.Item>
                  <h6>Description</h6>
                  <h6>{product.description}</h6>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            {/* Add to cart section */}
          </Row>
        </>
      )}
    </>
  );
};

export default ProductScreen;
