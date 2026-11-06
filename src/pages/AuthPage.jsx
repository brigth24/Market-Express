import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import authImg from '../assets/img/about.jpg';

const COPY = {
  login: {
    pill: 'Acceso clientes',
    title: 'Bienvenido de nuevo',
    sub: 'Ingresa con tu cuenta para comprar en Market Express.',
    submit: 'Iniciar sesión',
  },
  register: {
    pill: 'Acceso clientes',
    title: 'Crea tu cuenta',
    sub: 'Es rápido y gratis. Después podrás comprar en la tienda.',
    submit: 'Crear cuenta',
  },
  admin: {
    pill: 'Acceso administrador',
    title: 'Panel de administración',
    sub: 'Ingresa con tus credenciales de administrador.',
    submit: 'Ingresar',
  },
};

function PasswordField({ label, value, onChange, placeholder, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="field">
      <label>{label}</label>
      <div className={`input-wrap ${error ? 'has-error' : ''}`}>
        <input
          type={show ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
        />
        <button type="button" className="toggle" onClick={() => setShow((s) => !s)}>
          {show ? 'Ocultar' : 'Ver'}
        </button>
      </div>
      {error && <small className="error">{error}</small>}
    </div>
  );
}

export default function AuthPage({ mode }) {
  const copy = COPY[mode];
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const validate = () => {
    const err = {};
    if (mode === 'register' && form.name.trim().length < 3) err.name = 'Ingresa tu nombre completo.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = 'Ingresa un correo válido.';
    if (mode === 'register') {
      if (!/^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(form.password))
        err.password = 'Mínimo 8 caracteres, con letras y números.';
      if (form.confirm !== form.password) err.confirm = 'Las contraseñas no coinciden.';
    } else if (!form.password) {
      err.password = 'Ingresa tu contraseña.';
    }
    return err;
  };

  const submit = (e) => {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    const name =
      mode === 'register'
        ? form.name.trim()
        : mode === 'admin'
        ? 'María Laura'
        : form.email.split('@')[0];
    login({ name, email: form.email, role: mode === 'admin' ? 'admin' : 'cliente' });
    navigate(mode === 'admin' ? '/admin/resumen' : '/');
  };

  return (
    <div className="auth">
      <aside className="auth-aside" style={{ backgroundImage: `url(${authImg})` }}>
        <div className="auth-shade" />
        <div className="auth-aside-inner">
          <Logo variant="light" />
          <div>
            <h2>
              Tu mercado en línea,
              <br />
              siempre con stock.
            </h2>
            <p>Crea tu cuenta para comprar alimentos, bebidas y artículos de limpieza con stock confirmado.</p>
          </div>
          <small>© 2026 Market Express</small>
        </div>
      </aside>

      <main className="auth-main">
        <form className="auth-form" onSubmit={submit} noValidate>
          <span className="pill">{copy.pill}</span>
          <h1>{copy.title}</h1>
          <p className="auth-sub">{copy.sub}</p>

          {mode === 'register' && (
            <div className="field">
              <label>Nombre completo</label>
              <div className={`input-wrap ${errors.name ? 'has-error' : ''}`}>
                <input value={form.name} onChange={set('name')} placeholder="Ej. Ana Pérez" autoFocus />
              </div>
              {errors.name && <small className="error">{errors.name}</small>}
            </div>
          )}

          <div className="field">
            <label>Correo electrónico</label>
            <div className={`input-wrap ${errors.email ? 'has-error' : ''}`}>
              <input type="email" value={form.email} onChange={set('email')} placeholder="tucorreo@ejemplo.com" />
            </div>
            {errors.email && <small className="error">{errors.email}</small>}
          </div>

          <PasswordField
            label="Contraseña"
            value={form.password}
            onChange={set('password')}
            placeholder={mode === 'register' ? 'Mínimo 8 caracteres, con letras y números' : 'Tu contraseña'}
            error={errors.password}
          />

          {mode === 'register' && (
            <PasswordField
              label="Confirmar contraseña"
              value={form.confirm}
              onChange={set('confirm')}
              placeholder="Repite tu contraseña"
              error={errors.confirm}
            />
          )}

          <button className="btn btn-primary btn-block btn-lg" type="submit">{copy.submit}</button>

          <div className="auth-links">
            {mode === 'login' && (
              <>
                <p>¿Aún no tienes cuenta? <Link to="/registro">Crear cuenta</Link></p>
                <p>¿Eres administrador? <Link to="/admin">Ingresa aquí</Link></p>
              </>
            )}
            {mode === 'register' && (
              <p>¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link></p>
            )}
            {mode === 'admin' && (
              <p>¿Eres cliente? <Link to="/login">Ingresa aquí</Link></p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}
