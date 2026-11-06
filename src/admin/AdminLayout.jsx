import { Link, NavLink, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useInventory } from '../context/InventoryContext.jsx';

const NAV = [
  { to: '/admin/resumen', icon: '📊', label: 'Resumen' },
  { to: '/admin/productos', icon: '📦', label: 'Productos' },
  { to: '/admin/entradas', icon: '⬇️', label: 'Entradas' },
  { to: '/admin/salidas', icon: '⬆️', label: 'Salidas' },
  { to: '/admin/alertas', icon: '🔔', label: 'Alertas', badge: true },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const { alerts } = useInventory();

  // Solo el administrador entra al panel
  if (!user || user.role !== 'admin') return <Navigate to="/admin" replace />;

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link to="/admin/resumen" className="adm-brand">
          <span className="adm-logo">M</span>
          <span>
            <strong>Market Express</strong>
            <small>Panel administrador</small>
          </span>
        </Link>

        <nav className="adm-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'is-active' : '')}>
              <span aria-hidden="true">{n.icon}</span>
              {n.label}
              {n.badge && alerts.length > 0 && <b className="adm-count">{alerts.length}</b>}
            </NavLink>
          ))}
        </nav>

        <div className="adm-user">
          <strong>{user.name}</strong>
          <small>Administradora</small>
        </div>
        <Link to="/" className="adm-link">← Ver tienda</Link>
        <button className="adm-link" onClick={logout}>Cerrar sesión</button>
      </aside>

      <main className="adm-main">
        <Outlet />
      </main>
    </div>
  );
}
