import { money } from '../data/products.js';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, delay = 0 }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;
  const low = !soldOut && product.stock <= (product.min ?? 6);

  return (
    <article className="product" style={{ animationDelay: `${delay}ms` }}>
      <div className="product-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        {soldOut && <span className="badge badge--red">Agotado</span>}
        {low && <span className="badge badge--yellow">Últimas {product.stock}</span>}
      </div>
      <div className="product-body">
        <span className="product-cat">{product.category}</span>
        <h3>{product.name}</h3>
        <div className="product-row">
          <strong className="price">{money(product.price)}</strong>
          <button className="btn btn-primary btn-sm" disabled={soldOut} onClick={() => add(product)}>
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
