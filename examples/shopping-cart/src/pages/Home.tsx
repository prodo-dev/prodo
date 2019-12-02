import * as React from "react";
import Products from "./Products";
import Checkout from "./Checkout";

const Home = () => (
  <div className="home">
    <h2>Shopping Cart Example</h2>
    <hr />
    <Products />
    <Checkout />
  </div>
);

export default Home;
