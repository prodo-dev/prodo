import * as React from "react";

interface Props {
    title: string;
    price: number;
    quantity: number;
}
const CartItem: React.FC<Props> = ({ title, price, quantity }) => (
    <div>
        {title} - {price * quantity} - {quantity}
    </div>
);

export default CartItem;
