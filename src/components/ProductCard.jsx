import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const quantity = 1;
        addToCart(product, quantity);
        Swal.fire({
            title: `Agregaste Pilcha de UrbAngelo al carrito!`,
            icon: "success",
            draggable: true
        });
    };

    return (
        <div className="product-card">
            <Link to={`/product/${product.id}`} className="product-link">
                <img src={product.image} alt={product.name} className="product-image" />
            </Link>
            <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">Precio: ${product.price}</p>

                {product.stock > 0 ? (
                    <button onClick={handleAddToCart} className="add-to-cart-btn">
                        Agregar al carrito
                    </button>
                ) : (
                    <button disabled className="out-of-stock-btn">
                        Agotado
                    </button>
                )}

                <Link to={`/product/${product.id}`} className="view-details-btn">
                    Ver más detalles
                </Link>
            </div>
        </div>
    );
};

export default ProductCard;