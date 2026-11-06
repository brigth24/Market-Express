import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { PRODUCTS } from '../data/products.js';

/*
 * Inventario COMPARTIDO entre la tienda y el panel admin.
 * - La tienda lee los productos y su stock desde aquí.
 * - El panel admin registra productos, entradas y salidas.
 * - Finalizar compra en la tienda descuenta stock y crea una salida "Venta online".
 * Todo se guarda en localStorage (sin backend).
 */
const KEY = 'market-express-inventory-v1';

const PLACEHOLDER =
  'data:image/svg+xml,' +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='400' height='400' fill='#f4f1e4'/><text x='50%' y='54%' font-size='140' text-anchor='middle' dominant-baseline='middle'>🛒</text></svg>"
  );

const SEED_IMAGES = Object.fromEntries(PRODUCTS.map((p) => [p.id, p.image]));
const seedProducts = PRODUCTS.map(({ image, ...rest }) => rest);

const nameOf = (id) => PRODUCTS.find((p) => p.id === id)?.name ?? '';
const seedMovements = [
  { id: 'm1', type: 'entrada', productId: 1, name: nameOf(1), qty: 50, date: '2026-10-08T09:12:00', detail: 'Proveedor Alicorp' },
  { id: 'm2', type: 'salida', productId: 2, name: nameOf(2), qty: 8, date: '2026-10-08T11:40:00', detail: 'Venta tienda' },
  { id: 'm3', type: 'salida', productId: 8, name: nameOf(8), qty: 6, date: '2026-10-09T08:05:00', detail: 'Venta online' },
  { id: 'm4', type: 'entrada', productId: 5, name: nameOf(5), qty: 60, date: '2026-10-09T10:30:00', detail: 'Reposición' },
];

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (raw && Array.isArray(raw.products) && Array.isArray(raw.movements)) return raw;
  } catch {
    /* usar datos de ejemplo */
  }
  return { products: seedProducts, movements: seedMovements };
}

const InventoryContext = createContext(null);

// Fecha "YYYY-MM-DD" del formulario + hora actual (o ahora si viene vacía)
function toIso(dateStr) {
  const now = new Date();
  if (!dateStr) return now.toISOString();
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, m - 1, d, now.getHours(), now.getMinutes(), now.getSeconds()).toISOString();
}

let seq = 0;
const newId = () => `m${Date.now()}${seq++}`;

export function InventoryProvider({ children }) {
  const [data, setData] = useState(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* sin espacio o sin almacenamiento */
    }
  }, [data]);

  const products = useMemo(
    () =>
      data.products.map((p) => ({
        ...p,
        image: p.customImage || SEED_IMAGES[p.id] || PLACEHOLDER,
      })),
    [data.products]
  );

  const alerts = useMemo(() => products.filter((p) => p.stock <= p.min), [products]);
  const totals = useMemo(
    () => ({
      active: products.length,
      units: products.reduce((n, p) => n + p.stock, 0),
      value: products.reduce((s, p) => s + p.stock * p.price, 0),
    }),
    [products]
  );

  const movement = (type, p, qty, detail, dateIso, extra = {}) => ({
    id: newId(), type, productId: p.id, name: p.name, qty, detail, date: dateIso, ...extra,
  });

  const addProduct = ({ name, category, price, stock, min }) =>
    setData((d) => {
      const p = { id: Date.now(), name: name.trim(), category, price: +price, stock: +stock || 0, min: +min || 0 };
      const movements = p.stock > 0
        ? [...d.movements, movement('entrada', p, p.stock, 'Stock inicial', new Date().toISOString())]
        : d.movements;
      return { products: [...d.products, p], movements };
    });

  const removeProduct = (id) =>
    setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));

  const setMin = (id, min) =>
    setData((d) => ({ ...d, products: d.products.map((p) => (p.id === id ? { ...p, min } : p)) }));

  const setImage = (id, customImage) =>
    setData((d) => ({ ...d, products: d.products.map((p) => (p.id === id ? { ...p, customImage } : p)) }));

  const registerEntry = ({ productId, qty, cost, date, supplier, doc, note }) =>
    setData((d) => {
      const p = d.products.find((x) => x.id === productId);
      if (!p || qty <= 0) return d;
      const detail = supplier ? `Proveedor ${supplier}` : note || 'Entrada de almacén';
      return {
        products: d.products.map((x) => (x.id === productId ? { ...x, stock: x.stock + qty } : x)),
        movements: [...d.movements, movement('entrada', p, qty, detail, toIso(date), { cost, doc, note })],
      };
    });

  const registerExit = ({ productId, qty, responsible, reason, date, note }) =>
    setData((d) => {
      const p = d.products.find((x) => x.id === productId);
      if (!p || qty <= 0 || qty > p.stock) return d;
      return {
        products: d.products.map((x) => (x.id === productId ? { ...x, stock: x.stock - qty } : x)),
        movements: [...d.movements, movement('salida', p, qty, reason || 'Venta', toIso(date), { responsible, note })],
      };
    });

  // Compra desde la tienda: [{ id, qty }]
  const sellItems = (list) =>
    setData((d) => {
      let products = d.products;
      const movements = [...d.movements];
      list.forEach(({ id, qty }) => {
        const p = products.find((x) => x.id === id);
        if (!p) return;
        const q = Math.min(qty, p.stock);
        if (q <= 0) return;
        products = products.map((x) => (x.id === id ? { ...x, stock: x.stock - q } : x));
        movements.push(movement('salida', p, q, 'Venta online', new Date().toISOString(), { responsible: 'Cliente web' }));
      });
      return { products, movements };
    });

  const value = {
    products, movements: data.movements, alerts, totals,
    addProduct, removeProduct, setMin, setImage, registerEntry, registerExit, sellItems,
  };
  return <InventoryContext.Provider value={value}>{children}</InventoryContext.Provider>;
}

export const useInventory = () => useContext(InventoryContext);
