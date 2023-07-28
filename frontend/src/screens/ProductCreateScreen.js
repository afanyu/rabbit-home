import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import { createProduct } from "../actions/productActions";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";

const ProductCreateScreen = ({ match, history }) => {
  const productId = match.params.id;

  const [name, setName] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();

  // useSelector is to grab what we want from the state
  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  // make request here upon component load
  useEffect(() => {}, []); // Dependencies, on change they fire off useEffect)

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);
    try {
      const config = {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      };
      const { data } = await axios.post("/api/upload", formData, config);

      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      createProduct({
        name,
        user: userInfo._id,
        image,
        description,
        owner: {
          name: ownerName,
          contact: contactInfo,
        },
      })
    );
    history.redirect("/admin/productlist/1");
  };

  return (
    <>
      <Link to="/admin/productlist" className="btn btn-light my-3">
        Go Back
      </Link>
      <FormContainer>
        <h1>Creating a new rabbit</h1>
        {loadingUpdate && <Loader />}
        {errorUpdate && <Message variant="danger">{errorUpdate}</Message>}
        {/* On error, display message/error
            When loading, display Loading... */}
        {loading ? (
          <Loader />
        ) : error ? (
          <Message variant="danger">{error}</Message>
        ) : (
          <Form onSubmit={submitHandler}>
            {/* Name */}
            <Form.Group controlId="email">
              <Form.Label>Breed</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter breed"
                value={name}
                onChange={(e) => setName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Image */}
            <Form.Group controlId="image">
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image url"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              ></Form.Control>
              {/* Image file */}
              <Form.File
                id="image-file"
                label="Choose File"
                custom
                onChange={uploadFileHandler}
              ></Form.File>
              {uploading && <Loader />}
            </Form.Group>

            {/* Description */}
            <Form.Group controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="owner">
              <Form.Label>Owner name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Owner's name"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              ></Form.Control>
            </Form.Group>
            <Form.Group controlId="contact">
              <Form.Label>Contact Info</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Owner's contact info"
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
              ></Form.Control>
            </Form.Group>
            {/* Button */}
            <Button type="submit" variant="primary">
              Create
            </Button>
          </Form>
        )}
      </FormContainer>
    </>
  );
};

export default ProductCreateScreen;
