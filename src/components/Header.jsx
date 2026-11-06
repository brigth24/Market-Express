import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { count, openCart } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`site-header ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container header-inner">
        <Logo />
        <nav className="nav" aria-label="Principal">
          <a href="#catalogo">Catálogo</a>
          <a href="#categorias">Categorías</a>
          <a href="#nosotros">Nosotros</a>
        </nav>

        <div className="header-actions">
          {user ? (
            <>
              <span className="hello">Hola, {user.name.split(' ')[0]}</span>
              {user.role === 'admin' && <Link to="/admin/resumen" className="btn btn-ghost">Panel</Link>}
              <button className="btn btn-ghost" onClick={logout}>Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost">Ingresar</Link>
              <Link to="/registro" className="btn btn-primary">Crear cuenta</Link>
            </>
          )}
          <button className="btn btn-cart" onClick={openCart} aria-label={`Abrir carrito (${count})`}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
              <path d="M2 3h3l2.7 12.4a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6" />
            </svg>
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
