import { useParams } from 'react-router-dom';
import { useProducts } from '../firebase/firebase';
import ProductList from './ProductList';
import './ItemListContainer.css';

export default function ItemListContainer({ mensaje }) {
    const { category } = useParams();
    const { items: products, loading } = useProducts(category);

    const capitalizar = (str) => str.charAt(0).toUpperCase() + str.slice(1);
    const title = category ? capitalizar(category) : mensaje;

    return <ProductList title={title} products={products} loading={loading} />;
}







