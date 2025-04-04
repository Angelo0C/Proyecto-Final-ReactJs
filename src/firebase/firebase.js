import { initializeApp } from 'firebase/app';
import {
    getFirestore,
    doc,
    getDoc,
    getDocs,
    collection,
    query,
    where,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
    apiKey:'AIzaSyAOo_Cm2FpMLPuWSA7MgGmslr4LzmlgeOA',
    authDomain:'proyectofinal-fuentes.firebaseapp.com',
    projectId:'proyectofinal-fuentes',
    storageBucket:'proyectofinal-fuentes.firebasestorage.app',
    messagingSenderId:'490050214407',
    appId:'1:490050214407:web:75c0c9c6cd2839a9a4e8a2',
    measurementId:'G-3XF6QZ8CMG',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export async function getProduct(id) {
    try {
        const productRef = doc(db, 'products', id.toString());
        const productSnap = await getDoc(productRef);
        if (productSnap.exists()) {
            const data = { id: productSnap.id, ...productSnap.data() };
            console.log('Producto obtenido:', data);
            return data;
        } else {
            throw new Error('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error fetching product from Firestore:', error);
        throw error;
    }
}

export async function getProducts() {
    try {
        const querySnapshot = await getDocs(collection(db, 'products'));
        if (querySnapshot.size !== 0) {
            const productsList = querySnapshot.docs.map((docu) => {
                return {
                    id: docu.id,
                    ...docu.data(),
                };
            });
            console.log('Productos obtenidos:', productsList);
            return productsList;
        } else {
            console.log('Colección vacía!');
            return [];
        }
    } catch (error) {
        console.error('Error al obtener la colección:', error);
        throw new Error('No se pudieron cargar los productos. Intente nuevamente más tarde.');
    }
}

export async function getCategory(category) {
    try {
        const q = query(collection(db, 'products'), where('category', '==', category));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.size !== 0) {
            const productsList = querySnapshot.docs.map((docu) => {
                return {
                    id: docu.id,
                    ...docu.data(),
                };
            });
            console.log('Productos por categoría obtenidos:', productsList);
            return productsList;
        } else {
            console.log('Colección vacía para esta categoría!');
        }
    } catch (error) {
        console.error('Error fetching category from Firestore:', error);
    }
}

export const useProducts = (category) => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let products;
                if (category) {
                    products = await getCategory(category);
                } else {
                    products = await getProducts();
                }
                console.log('Productos obtenidos en useProducts:', products);
                setItems(products || []);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [category]);

    return { items, loading };
};

export { db };