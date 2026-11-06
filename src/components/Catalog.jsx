import { useMemo, useState } from 'react';
import { useInventory } from '../context/InventoryContext.jsx';
import ProductCard from './ProductCard.jsx';

const FILTERS = [
  { id: 'todos', label: 'Todos' },
  { id: 'alimentos', label: 'Alimentos' },
  { id: 'bebidas', label: 'Bebidas' },
  { id: 'limpieza', label: 'Limpieza' },
];

const normalize = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export default function Catalog({ category, setCategory }) {
  const { products: PRODUCTS } = useInventory();
  const [query, setQuery] = useState('');

  const visible = useMemo(() => {
    const q = normalize(query.trim());
    return PRODUCTS.filter(
      (p) =>
        (category === 'todos' || p.category === category) &&
        (!q || normalize(p.name).includes(q))
    );
  }, [PRODUCTS, category, query]);

  return (
    <section id="catalogo" className="section container">
      <div className="catalog-head">
        <div>
          <span className="eyebrow">Catálogo</span>
          <h2 className="section-title">Productos destacados</h2>
        </div>
        <div className="pills" role="tablist" aria-label="Filtrar por categoría">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={category === f.id}
              className={category === f.id ? 'is-active' : ''}
              onClick={() => setCategory(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <label className="search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {visible.length ? (
        <div className="product-grid" key={`${category}-${query}`}>
          {visible.map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 40} />
          ))}
        </div>
      ) : (
        <p className="empty-state">No encontramos productos con esa búsqueda.</p>
      )}
    </section>
  );
}
