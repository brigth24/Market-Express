import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../data/products.js';

export default function CartDrawer() {
  const { items, total, open, closeCart, changeQty, remove, checkout: placeOrder } = useCart();
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && closeCart();
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeCart]);

  useEffect(() => {
    if (!open) setOrdered(false);
  }, [open]);

  const checkout = () => {
    placeOrder();
    setOrdered(true); // Demostración: no se envía a ningún servidor.
  };

  return (
    <>
      <div className={`backdrop ${open ? 'is-open' : ''}`} onClick={closeCart} />
      <aside className={`drawer ${open ? 'is-open' : ''}`} role="dialog" aria-label="Tu carrito" aria-hidden={!open}>
        <header className="drawer-head">
          <h3>Tu carrito</h3>
          <button className="icon-btn" onClick={closeCart} aria-label="Cerrar carrito">×</button>
        </header>

        <div className="drawer-body">
          {ordered ? (
            <p className="drawer-empty">¡Gracias! Tu pedido fue registrado (demostración).</p>
          ) : items.length === 0 ? (
            <p className="drawer-empty">Tu carrito está vacío.</p>
          ) : (
            <ul className="cart-list">
              {items.map(({ id, qty, product }) => (
                <li key={id} className="cart-item">
                  <img src={product.image} alt="" />
                  <div className="cart-info">
                    <strong>{product.name}</strong>
                    <span>{money(product.price)}</span>
                    <div className="qty">
                      <button onClick={() => changeQty(id, -1)} aria-label="Quitar uno">−</button>
                      <b>{qty}</b>
                      <button onClick={() => changeQty(id, 1)} disabled={qty >= product.stock} aria-label="Agregar uno">+</button>
                    </div>
                  </div>
                  <div className="cart-side">
                    <strong>{money(product.price * qty)}</strong>
                    <button className="link-btn" onClick={() => remove(id)}>Quitar</button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <footer className="drawer-foot">
          <div className="drawer-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>
          <button className="btn btn-primary btn-block" disabled={!items.length} onClick={checkout}>
            Finalizar compra
          </button>
        </footer>
      </aside>
    </>
  );
}
