import { useState } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import { CATEGORIES } from '../data/products.js';
import { StockBadge, money } from './helpers.jsx';

const EMPTY = { name: '', category: 'alimentos', price: '', stock: '', min: '' };

export default function ProductsAdmin() {
  const { products, addProduct, removeProduct, setMin } = useInventory();
  const [form, setForm] = useState(EMPTY);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return setError('Escribe el nombre del producto.');
    if (!(+form.price > 0)) return setError('Ingresa un precio válido.');
    if (form.stock !== '' && +form.stock < 0) return setError('El stock no puede ser negativo.');
    setError('');
    addProduct(form);
    setForm(EMPTY);
  };

  const remove = (p) => {
    if (window.confirm(`¿Retirar "${p.name}" del catálogo? Dejará de mostrarse en la tienda.`)) removeProduct(p.id);
  };

  const q = query.trim().toLowerCase();
  const visible = products.filter((p) => !q || p.name.toLowerCase().includes(q));

  return (
    <>
      <h1 className="a-title">Productos</h1>
      <p className="a-sub">Registra, busca, edita y retira productos del catálogo.</p>

      <form className="a-card a-form-row" onSubmit={submit}>
        <input placeholder="Nombre del producto" value={form.name} onChange={set('name')} />
        <select value={form.category} onChange={set('category')}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
        <input type="number" min="0" step="0.01" placeholder="Precio S/" value={form.price} onChange={set('price')} />
        <input type="number" min="0" placeholder="Stock" value={form.stock} onChange={set('stock')} />
        <input type="number" min="0" placeholder="Stock mínimo" value={form.min} onChange={set('min')} />
        <div className="a-form-foot">
          {error && <span className="a-error">{error}</span>}
          <button className="a-btn" type="submit">+ Registrar</button>
        </div>
      </form>

      <label className="a-search">
        🔍
        <input placeholder="Buscar productos..." value={query} onChange={(e) => setQuery(e.target.value)} />
      </label>

      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr><th>Producto</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>Mínimo</th><th>Estado</th></tr>
          </thead>
          <tbody>
            {visible.map((p) => (
              <tr key={p.id}>
                <td><span className="a-item"><img src={p.image} alt="" />{p.name}</span></td>
                <td className="cap">{p.category}</td>
                <td>{money(p.price)}</td>
                <td><StockBadge p={p} /></td>
                <td>
                  <input
                    className="a-min"
                    type="number"
                    min="0"
                    value={p.min}
                    onChange={(e) => setMin(p.id, Math.max(0, +e.target.value || 0))}
                    aria-label={`Stock mínimo de ${p.name}`}
                  />
                </td>
                <td><button className="a-link" onClick={() => remove(p)}>Retirar</button></td>
              </tr>
            ))}
            {visible.length === 0 && <tr><td colSpan="6" className="a-hint">No hay productos.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
