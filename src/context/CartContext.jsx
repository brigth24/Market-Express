import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useInventory } from './InventoryContext.jsx';

const CartContext = createContext(null);
const STORAGE_KEY = 'market-express-cart';

function loadItems() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { products, sellItems } = useInventory();
  const [items, setItems] = useState(loadItems); // [{ id, qty }]
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState('');
  const toastTimer = useRef(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* sin almacenamiento disponible */
    }
  }, [items]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 1800);
  };

  const add = (product) => {
    if (product.stock <= 0) return;
    setItems((prev) => {
      const found = prev.find((i) => i.id === product.id);
      if (!found) return [...prev, { id: product.id, qty: 1 }];
      if (found.qty >= product.stock) return prev;
      return prev.map((i) => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    });
    showToast(`${product.name} agregado al carrito`);
  };

  const changeQty = (id, delta) => {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id ? { ...i, qty: Math.min(product.stock, i.qty + delta) } : i
        )
        .filter((i) => i.qty > 0)
    );
  };

  const remove = (id) => setItems((prev) => prev.filter((i) => i.id !== id));
  const clear = () => setItems([]);

  // Finalizar compra: descuenta el stock y registra las salidas ("Venta online") en el panel admin
  const checkout = () => {
    sellItems(items.map(({ id, qty }) => ({ id, qty })));
    setItems([]);
  };

  const detailed = useMemo(
    () =>
      items
        .map((i) => ({ ...i, product: products.find((p) => p.id === i.id) }))
        .filter((i) => i.product),
    [items, products]
  );
  const count = items.reduce((n, i) => n + i.qty, 0);
  const total = detailed.reduce((s, i) => s + i.qty * i.product.price, 0);

  const value = {
    items: detailed,
    count,
    total,
    open,
    toast,
    openCart: () => setOpen(true),
    closeCart: () => setOpen(false),
    add,
    changeQty,
    remove,
    clear,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
