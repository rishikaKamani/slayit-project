import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('slayit_token'));
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem('slayit_user');
    return raw ? JSON.parse(raw) : null;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('slayit_token', token);
    } else {
      localStorage.removeItem('slayit_token');
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('slayit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('slayit_user');
    }
  }, [user]);

  const login = async (payload) => {
    const response = await api.post('/auth/login', payload);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const signup = async (payload) => {
    const response = await api.post('/auth/signup', payload);
    setToken(response.data.token);
    setUser(response.data.user);
    return response.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({ token, user, isAuthenticated: Boolean(token), login, signup, logout }),
    [token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
