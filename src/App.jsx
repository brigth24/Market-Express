import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home.jsx';
import AuthPage from './pages/AuthPage.jsx';
import AdminLayout from './admin/AdminLayout.jsx';
import Dashboard from './admin/Dashboard.jsx';
import ProductsAdmin from './admin/ProductsAdmin.jsx';
import Entries from './admin/Entries.jsx';
import Exits from './admin/Exits.jsx';
import Alerts from './admin/Alerts.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/registro" element={<AuthPage mode="register" />} />
      <Route path="/admin" element={<AuthPage mode="admin" />} />
      <Route element={<AdminLayout />}>
        <Route path="/admin/resumen" element={<Dashboard />} />
        <Route path="/admin/productos" element={<ProductsAdmin />} />
        <Route path="/admin/entradas" element={<Entries />} />
        <Route path="/admin/salidas" element={<Exits />} />
        <Route path="/admin/alertas" element={<Alerts />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
