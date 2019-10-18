import * as React from "react";
import { state, watch, dispatch } from "../model";
import ProductList from "../components/ProductList";
import ProductItem from "../components/ProductItem";
import { addToCart } from "../actions/product";

const Products = () => {
    const products = watch(state.products);
    return (
        <div>
            <ProductList title="Products">
                {
                    products ?
                        products.map((product, ind) => (
                            <ProductItem
                                key={product.id}
                                data={product}
                                onAddToCart={() => dispatch(addToCart)(product.id, ind)}
                            />
                        )) : null
                }
            </ProductList>
        </div>
    )
};

export default Products;
