import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import './ProductDetail.css';

export default function ItemDetail({ product, loading, error }) {
    const { addToCart } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [goToCart, setGoToCart] = useState(false);
    const navigate = useNavigate();

    if (loading) return <p className="loading">Cargando producto...</p>;
    if (error) return <p className="error">{error}</p>;
    if (!product) return <p>Producto no encontrado.</p>;

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setGoToCart(true);
        Swal.fire({
            title: `Agregaste ${quantity} ${quantity === 1 ? 'item' : 'items'} al carrito!`,
            icon: "success",
            draggable: true,
        });
    };

    const toggleModal = () => setShowModal(!showModal);

    const handleContinueShopping = () => {
        setGoToCart(false);
        navigate('/');
    };

    return (
        <div className="item-detail-container">
            <img src={product.image} alt={product.name} className="product-image" />
   
  
        
            <p className="price">Precio: ${product.price}</p>

            {!goToCart ? (
                <div>
                    {product.stock > 0 ? (
                        <>
                            <div className="quantity-selector">
                                <label htmlFor="quantity">Cantidad:</label>
                                <select
                                    id="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value))}
                                >
                                    {[...Array(product.stock).keys()].map((i) => (
                                        <option key={i + 1} value={i + 1}>
                                            {i + 1}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="add-to-cart-btn" onClick={handleAddToCart}>
                                Agregar al carrito
                            </button>
                        </>
                    ) : (
                        <button disabled className="out-of-stock-btn">
                            No disponible
                        </button>
                    )}
                </div>
            ) : (
                <div className="go-to-cart">
                    <Link to="/cart" className="go-to-cart-btn">
                        Ir al carrito
                    </Link>
                    <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                        Seguir comprando
                    </button>
                </div>
            )}
            {showModal && (
                <div className="modal" onClick={toggleModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <span className="close-btn" onClick={toggleModal}>
                            &times;
                        </span>
                        <div className="description">{product.description}</div>
                    </div>
                </div>
            )}
        </div>
    );
}