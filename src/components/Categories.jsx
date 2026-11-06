import { CATEGORIES } from '../data/products.js';

export default function Categories({ onSelect }) {
  return (
    <section id="categorias" className="section container">
      <h2 className="section-title">Compra por categoría</h2>
      <div className="cat-grid">
        {CATEGORIES.map((c) => (
          <button key={c.id} className="cat-card" onClick={() => onSelect(c.id)}>
            <img src={c.image} alt="" />
            <span className="cat-shade" />
            <span className="cat-info">
              <strong>{c.label}</strong>
              <small>Ver productos →</small>
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
