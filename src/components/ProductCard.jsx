import React from 'react';

const ProductCard = ({ product }) => {
    return (
        <div className="product-card">
        <img src={product.img} alt={product.name} />
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <p>Precio: {product.price}</p>
        <p>{product.available ? "Disponible" : "Agotado"}</p>
        {product.best_seller && <span>Más Vendido</span>}
        </div>
    );
};

export default ProductCard;