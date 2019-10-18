import * as React from "react";

interface Props {
    title: string;
}
const ProductList: React.FC<Props> = ({ title, children }) => (
    <div className="container">
        <h3>{title}</h3>
        <div>{children}</div>
    </div>
);

export default ProductList;
