import { createContext, useContext, useMemo, useState } from 'react';
import { authService } from '../services/authService';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('inventia_user') || 'null'));
  const login = async (payload) => { const { data } = await authService.login(payload); localStorage.setItem('access_token', data.data.accessToken); localStorage.setItem('refresh_token', data.data.refreshToken); localStorage.setItem('inventia_user', JSON.stringify(data.data.user)); setUser(data.data.user); };
  const logout = () => { localStorage.clear(); setUser(null); };
  const value = useMemo(() => ({ user, login, logout, isAuthenticated: Boolean(user), hasRole: (roles) => user?.roles?.some((r) => roles.includes(r)) }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
