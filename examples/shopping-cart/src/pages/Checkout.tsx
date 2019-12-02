import * as React from "react";
import { state, watch } from "../model";
import { getCartProducts } from "../actions/product";
import CartItem from "../components/CartItem";

const Checkout = () => {
    const carts = watch(state.carts);
    const cartItems = getCartProducts(carts);
    const gotItemsInCart = cartItems.length > 0;
    const cartRow = cartItems.map((cart, ind) => (
        <CartItem key={ind} {...cart} />
    ));
    const noItemsMessage = <p>Let’s do shopping :)</p>;
    const cartList = gotItemsInCart ? cartRow : noItemsMessage;
    return (
        <div>
            <h3>Cart</h3>
            {cartList}
            <p>Total: 💰{watch(state.total)}</p>
        </div>
    )
};

export default Checkout;