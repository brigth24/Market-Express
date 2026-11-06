import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useInventory } from '../context/InventoryContext.jsx';
import { StockBadge, fmtDate, money } from './helpers.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const { totals, alerts, movements } = useInventory();
  const last = [...movements].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 4);

  return (
    <>
      <h1 className="a-title">Hola, {user.name} 👋</h1>
      <p className="a-sub">Así está tu inventario hoy, en tiempo real.</p>

      <div className="a-stats">
        <div className="a-stat a-stat--green"><span>Productos activos</span><strong>{totals.active}</strong></div>
        <div className="a-stat"><span>Unidades en almacén</span><strong>{totals.units}</strong></div>
        <div className="a-stat"><span>Valor del inventario</span><strong>{money(totals.value)}</strong></div>
        <div className="a-stat a-stat--yellow"><span>Alertas de stock</span><strong>{alerts.length}</strong></div>
      </div>

      <div className="a-two">
        <section className="a-card">
          <div className="a-card-head">
            <h3>Por agotarse</h3>
            <Link to="/admin/alertas" className="a-link">Ver todo</Link>
          </div>
          {alerts.length === 0 && <p className="a-hint">Todo en orden: no hay productos por reponer.</p>}
          <ul className="a-list">
            {alerts.map((p) => (
              <li key={p.id}>
                <span className="a-item"><img src={p.image} alt="" />{p.name}</span>
                <StockBadge p={p} />
              </li>
            ))}
          </ul>
        </section>

        <section className="a-card">
          <div className="a-card-head">
            <h3>Últimos movimientos</h3>
            <Link to="/admin/entradas" className="a-link">Registrar</Link>
          </div>
          <ul className="a-list a-list--mov">
            {last.map((m) => (
              <li key={m.id}>
                <div>
                  <strong>{m.name}</strong>
                  <small>{fmtDate(m.date)} · {m.detail}</small>
                </div>
                <b className={m.type === 'entrada' ? 'pos' : 'neg'}>
                  {m.type === 'entrada' ? '+' : '−'}{m.qty}
                </b>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
