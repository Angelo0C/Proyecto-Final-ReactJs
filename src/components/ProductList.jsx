import ProductCard from './ProductCard';
import './ItemListContainer.css';

export default function ProductList({ title, products, loading }) {
    if (loading) {
        return <p className="loading">CARGANDO PRODUCTOS...</p>;
    }

    return (
        <main>
            <h1>{title}</h1>
            <div className="product-list">
                {products.length > 0 ? (
                    products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>No hay productos disponibles en esta categoría.</p>
                )}
            </div>
        </main>
    );
}