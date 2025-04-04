import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './NavBar.css';
import Logo from './Logo';
import CartWidget from './CartWidget';
import ButtonComponent from './ButtonComponent';

export default function NavBar() {
    const { cart } = useCart();
    const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header>
            <nav>
                <Link to="/">
                    <Logo />
                </Link>
                <div>
                    <NavLink
                        to="/category/remeras"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        <ButtonComponent text="Remeras" />
                    </NavLink>
                    <NavLink
                        to="/category/hoodies"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        <ButtonComponent text="Abrigos" />
                    </NavLink>
                    <NavLink
                        to="/category/pantalones"
                        className={({ isActive }) => (isActive ? 'active-link' : '')}
                    >
                        <ButtonComponent text="Pantalones" />
                    </NavLink>
                </div>
                <Link to="/cart">
                    <CartWidget cartCount={totalItems} />
                </Link>
            </nav>
        </header>
    );
}