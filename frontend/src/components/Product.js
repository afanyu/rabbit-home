import React from "react";
import { Link } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import Rating from "./Rating";

const Product = ({ product }) => {
  return (
    <Link to={`/product/${product._id}`}>
      <Card className="my-3 p-3 rounded">
        {/* Product image */}
        <Card.Img src={product.image} variant="top" />
        <Card.Body>
          <Link to={`/product/${product._id}`}>
            {/* Product name */}
            <Card.Title as="div">
              <strong>{product.name}</strong>
            </Card.Title>
          </Link>
          <h5>Details</h5>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default Product;
