import { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem('cart'));
        if (savedCart) {
            setCart(savedCart);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity) => {
        const validQuantity = parseInt(quantity, 10);
        if (isNaN(validQuantity) || validQuantity <= 0) return;

        setCart((prevCart) => {
            const existingProduct = prevCart.find((p) => p.id === product.id);
            if (existingProduct) {
                return prevCart.map((p) =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + validQuantity }
                        : p
                );
            } else {
                return [...prevCart, { ...product, quantity: validQuantity }];
            }
        });
    };

    const removeFromCart = (id) => {
        setCart((prevCart) => prevCart.filter((product) => product.id !== id));
    };

    const getTotalPrice = () => {
        return cart.reduce((acc, product) => acc + product.price * product.quantity, 0);
    };

    const getTotalQuantity = () => {
        return cart.reduce((acc, product) => acc + product.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart, getTotalPrice, getTotalQuantity, clearCart }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
