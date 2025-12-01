import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService } from '../services/api';

// =============================================
// CONTEXTO DE AUTENTICACIÓN
// =============================================
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

// Proveedor de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Decodificar token JWT
  const decodeToken = useCallback((token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  }, []);

  // Verificar si el token es válido
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    const decoded = decodeToken(token);
    if (!decoded) return false;
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  }, [decodeToken]);

  // Cargar sesión desde localStorage al iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      try {
        if (isTokenValid(storedToken)) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        } else {
          // Token expirado
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error al cargar sesión:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, [isTokenValid]);

  // Guardar sesión en localStorage
  const saveSession = (token, userData) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Login para compradores
  const loginComprador = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      const userData = {
        id: response.id,
        email: response.email,
        nombre: response.nombre,
        rol: response.rol
      };
      saveSession(response.token, userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  // Login para administradores
  const loginAdmin = async (email, password) => {
    try {
      const response = await authService.loginAdmin(email, password);
      const userData = {
        id: response.id,
        email: response.email,
        nombre: response.nombre,
        rol: response.rol
      };
      saveSession(response.token, userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  // Registro de nuevo comprador
  const registro = async (nombre, email, password, confirmPassword) => {
    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }
      if (password.length < 6) {
        throw new Error('La contraseña debe tener al menos 6 caracteres');
      }

      const response = await authService.registro(nombre, email, password, confirmPassword);
      const userData = {
        id: response.id,
        email: response.email,
        nombre: response.nombre,
        rol: response.rol
      };
      saveSession(response.token, userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.response?.data?.error || error.message };
    }
  };

  // Cerrar sesión
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Verificar si está autenticado
  const isAuthenticated = useCallback(() => {
    if (token && user) {
      return isTokenValid(token);
    }
    const storedToken = localStorage.getItem('token');
    return storedToken ? isTokenValid(storedToken) : false;
  }, [token, user, isTokenValid]);

  // Verificar si es administrador
  const isAdmin = useCallback(() => {
    if (!isAuthenticated()) return false;
    return user?.rol === 'administrador';
  }, [user, isAuthenticated]);

  // Verificar si es comprador
  const isComprador = useCallback(() => {
    if (!isAuthenticated()) return false;
    return user?.rol === 'comprador';
  }, [user, isAuthenticated]);

  const value = {
    user,
    token,
    loading,
    loginComprador,
    loginAdmin,
    registro,
    logout,
    isAuthenticated,
    isAdmin,
    isComprador
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
