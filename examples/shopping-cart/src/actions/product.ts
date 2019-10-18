import _products from '../data/products.json'
import { state, Product, Cart } from "../model";

export function getAllProducts(): Product[] {
    state.products = _products;
    return _products;
};

export function findProductInCart(productId: number, carts: Cart[]): number {
    const cartIndex = Object.values(carts).findIndex(cart => {
        return cart.productId == productId;
    });
    return cartIndex;
}

export const addToCart = (productId: number, index: number) => {
    const cartIndex = findProductInCart(productId, state.carts);
    if (cartIndex > -1) {
        state.carts[cartIndex].quantity++
    } else {
        state.carts[state.carts.length] = { productId, quantity: 1 }
    }
    state.products[index].quantity--;
    state.total += state.products[index].price;
};

export const updateProductQuantity = (productId: number) => {
    const productIndex = state.products.findIndex((prod) => {
        return prod.id == productId;
    });
    const product = state.products[productIndex];
    if (product) {
        product.quantity = product.quantity--;
    }
    state.products[productIndex] = product;
}

export const getCartProducts = (carts: Cart[]): Product[] => {
    const products = carts.map((cart) => {
        const prod = [..._products].find((product) => {
            return product.id == cart.productId;
        }) as Product;
        prod.quantity = cart.quantity;
        return prod;
    });
    return products;
};
