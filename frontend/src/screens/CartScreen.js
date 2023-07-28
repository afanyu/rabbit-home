import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, ListGroup, Image, Form, Button, Card } from 'react-bootstrap'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../actions/cartActions'

const CartScreen = ({ match, location, history }) => {
	// Get product id
	const productId = match.params.id

	// Get the quantity ?qty=x
	const qty = location.search ? Number(location.search.split('=')[1]) : 1

	const dispatch = useDispatch()

	// useSelector is to grab what we want from the state
	const cart = useSelector((state) => state.cart)
	const { cartItems } = cart
console.log(cartItems)
	// Add two decimals to price if needed
	const addDecimals = (num) => {
		return (Math.round(num * 100) / 100).toFixed(2)
	}

	// make request here upon component load
	useEffect(() => {
		// Fire off action to add item and quantity to cart
		if (productId) {
			dispatch(addToCart(productId, qty))
		}
	}, [dispatch, productId, qty]) // Dependencies, on change they fire off useEffect

	const removeFromCartHandler = (id) => {
		dispatch(removeFromCart(id))
	}
	const checkoutHandler = () => {
		history.push('/login?redirect=shipping')
	}
	return (
		<Row>
			<Col md={8}>
				<h1>Your Requests</h1>
				{cartItems.length === 0 ? (
					<Message>
						Your Request list is empty <Link to='/'>Go Back</Link>
					</Message>
				) : (
					<ListGroup variant='flush'>
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
										<Link to={`/product/${item.product}`}>{item?.owner?.name}</Link>
									</Col>
									<Col md={2}>
										<Button
											type='button'
											variant='light'
											onClick={() => removeFromCartHandler(item.product)}
										>
											<i className='fas fa-trash'></i>
										</Button>
									</Col>
								</Row>
							</ListGroup.Item>
						))}
					</ListGroup>
				)}
			</Col>
		</Row>
	)
}

export default CartScreen
