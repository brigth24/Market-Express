import { useNavigate } from 'react-router-dom';
import { useInventory } from '../context/InventoryContext.jsx';
import { StockBadge } from './helpers.jsx';

export default function Alerts() {
  const { alerts } = useInventory();
  const navigate = useNavigate();
  const sorted = [...alerts].sort((a, b) => a.stock / (a.min || 1) - b.stock / (b.min || 1));

  return (
    <>
      <h1 className="a-title">Alertas de stock</h1>
      <p className="a-sub">Productos en o por debajo de su nivel mínimo — lista para reponer.</p>

      {sorted.length === 0 && <p className="a-hint">Todo en orden: no hay productos por reponer.</p>}
      <div className="a-alerts">
        {sorted.map((p) => (
          <article key={p.id} className={`a-alert ${p.stock <= 0 ? 'is-out' : ''}`}>
            <div className="a-alert-top">
              <img src={p.image} alt="" />
              <StockBadge p={p} />
            </div>
            <h3>{p.name}</h3>
            <p>Reponer al menos <b>{Math.max(1, p.min * 2 - p.stock)}</b> unidades</p>
            <button className="a-btn a-btn--block" onClick={() => navigate(`/admin/entradas?producto=${p.id}`)}>
              Registrar reposición
            </button>
          </article>
        ))}
      </div>
    </>
  );
}
