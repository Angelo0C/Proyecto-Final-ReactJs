import React from 'react';
import { useCart } from '../context/CartContext';
import './CartWidget.css';

export default function CartWidget() {
    const { getTotalQuantity } = useCart();
    const cartCount = getTotalQuantity();

    return (
        <div className="carrito-contenedor">
            <img src="/carrito.svg" alt="Widget del carrito de compras" className="carrito" />
            <span className="carrito-cantidad">{cartCount || 0}</span>
        </div>
    );
}