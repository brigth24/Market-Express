import { createContext, useContext, useState } from 'react';

// Sesión SIMULADA solo con localStorage (no hay backend).
const AuthContext = createContext(null);
const KEY = 'market-express-user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY) || 'null');
    } catch {
      return null;
    }
  });

  const login = (data) => {
    setUser(data);
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch {
      /* ignorar */
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignorar */
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
