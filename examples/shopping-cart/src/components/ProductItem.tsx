import * as React from "react";
import { Product } from "../model";

interface Props {
    data: Product;
    key: number;
    onAddToCart: (key: number) => void;
}
const ProductItem: React.FC<Props> = ({ data: { title, price, quantity, id }, onAddToCart }) => (
    <div>
        {title} - 💲{price} - {quantity ? `X ${quantity}` : 'Sold out'}
        <br />
        <button onClick={() => onAddToCart(id)} disabled={quantity > 0 ? false : true}>Add to Cart</button>
    </div>
);

export default ProductItem;
