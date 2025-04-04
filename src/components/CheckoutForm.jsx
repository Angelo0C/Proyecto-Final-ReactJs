import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import './CheckoutForm.css';

const CheckoutForm = () => {
    const { cart, getTotalPrice, clearCart } = useCart();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        confirmEmail: '',
        phone: '',
        address: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [touched, setTouched] = useState({});

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched({ ...touched, [name]: true });
        validateField(name, formData[name]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (touched[name]) {
            validateField(name, value);
        }
    };

    const validateField = (fieldName, value) => {
        let newErrors = { ...errors };

        switch (fieldName) {
            case 'name':
                if (!value.trim()) {
                    newErrors.name = 'El nombre es obligatorio';
                } else if (value.trim().length < 3) {
                    newErrors.name = 'El nombre debe tener al menos 3 caracteres';
                } else {
                    delete newErrors.name;
                }
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    newErrors.email = 'El email es obligatorio';
                } else if (!emailRegex.test(value)) {
                    newErrors.email = 'Ingrese un email válido';
                } else {
                    delete newErrors.email;
                }
                
                if (formData.confirmEmail && formData.confirmEmail !== value) {
                    newErrors.confirmEmail = 'Los emails no coinciden';
                } else if (formData.confirmEmail && formData.confirmEmail === value) {
                    delete newErrors.confirmEmail;
                }
                break;
            case 'confirmEmail':
                if (value !== formData.email) {
                    newErrors.confirmEmail = 'Los emails no coinciden';
                } else {
                    delete newErrors.confirmEmail;
                }
                break;
            case 'phone':
                const phoneRegex = /^\d{7,15}$/;
                if (!value.trim()) {
                    newErrors.phone = 'El teléfono es obligatorio';
                } else if (!phoneRegex.test(value.replace(/[-()\s]/g, ''))) {
                    newErrors.phone = 'Ingrese un número de teléfono válido';
                } else {
                    delete newErrors.phone;
                }
                break;
            case 'address':
                if (!value.trim()) {
                    newErrors.address = 'La dirección es obligatoria';
                } else {
                    delete newErrors.address;
                }
                break;
            default:
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validateForm = () => {
        const allTouched = Object.keys(formData).reduce((acc, field) => {
            acc[field] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        let valid = true;
        Object.keys(formData).forEach(field => {
            const fieldValid = validateField(field, formData[field]);
            valid = valid && fieldValid;
        });

        return valid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            Swal.fire({
                title: 'Error en el formulario',
                text: 'Por favor, revisa los campos marcados en rojo',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            return;
        }

        if (cart.length === 0) {
            Swal.fire({
                title: 'Carrito vacío',
                text: 'No puedes realizar una compra con el carrito vacío',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            navigate('/');
            return;
        }

        setIsSubmitting(true);

        const orderData = {
            buyer: {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                address: formData.address
            },
            items: cart.map(product => ({
                id: product.id,
                name: product.name,
                price: product.price,
                quantity: product.quantity
            })),
            total: getTotalPrice(),
            date: serverTimestamp()
        };

        try {
            const orderRef = await addDoc(collection(db, 'orders'), orderData);

            Swal.fire({
                title: '¡Gracias Por Comprar En UrbAngelo!',
                text: `Tu número de orden es: ${orderRef.id}`,
                icon: 'success',
                confirmButtonText: 'Aceptar'
            }).then(() => {
                clearCart();
                navigate('/');
            });

        } catch (error) {
            console.error('Error al procesar la orden:', error);
            
            Swal.fire({
                title: 'Error al procesar la orden',
                text: 'Por favor, intenta nuevamente más tarde',
                icon: 'error',
                confirmButtonText: 'Aceptar'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="checkout-container">
            <h2>Finalizar Compra</h2>
            <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                    <label htmlFor="name">Nombre completo:</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        className={touched.name && errors.name ? 'error' : ''} 
                    />
                    {touched.name && errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        className={touched.email && errors.email ? 'error' : ''} 
                    />
                    {touched.email && errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="confirmEmail">Confirmar Email:</label>
                    <input 
                        type="email" 
                        id="confirmEmail" 
                        name="confirmEmail" 
                        value={formData.confirmEmail} 
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        className={touched.confirmEmail && errors.confirmEmail ? 'error' : ''} 
                    />
                    {touched.confirmEmail && errors.confirmEmail && <span className="error-message">{errors.confirmEmail}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="phone">Teléfono:</label>
                    <input 
                        type="tel" 
                        id="phone" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        className={touched.phone && errors.phone ? 'error' : ''} 
                    />
                    {touched.phone && errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                    <label htmlFor="address">Dirección de envío:</label>
                    <input 
                        type="text" 
                        id="address" 
                        name="address" 
                        value={formData.address} 
                        onChange={handleChange}
                        onBlur={handleBlur} 
                        className={touched.address && errors.address ? 'error' : ''} 
                    />
                    {touched.address && errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="order-summary">
                    <h3>Resumen de la Orden</h3>
                    <p>Total de productos: {cart.reduce((acc, product) => acc + product.quantity, 0)}</p>
                    <p>Total a pagar: ${getTotalPrice()}</p>
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn" onClick={() => navigate('/cart')}>Volver al carrito</button>
                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Procesando...' : 'Confirmar compra'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CheckoutForm;