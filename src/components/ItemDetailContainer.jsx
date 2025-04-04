import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProduct } from '../firebase/firebase';
import ItemDetail from './ProductDetail';
import './ItemDetailContainer.css';

export default function ItemDetailContainer() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const productData = await getProduct(id);
                setProduct(productData);
            } catch (error) {
                setError("Error al cargar el producto");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    return (
        <ItemDetail product={product} loading={loading} error={error} />
    );
}