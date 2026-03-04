import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/login';

interface User {
  id: number;
  username: string;
  role: {
    id: number;
    name: string;
  };
}

export const login = async (username: string, password: string): Promise<User> => {
  try {
    const response = await axios.post(API_URL, { username, password });

    // El backend ahora devuelve { token: "...", user: {...} }
    const { token, user } = response.data;

    if (!user || !user.role || typeof user.role.id === 'undefined') {
      throw new Error('Estructura de usuario inválida');
    }

    const userInfo = {
      id: user.id,
      username: user.username,
      roleId: user.role.id,
      token: token
    };

    localStorage.setItem('user', JSON.stringify(userInfo));

    // También guardamos el token explícitamente para facilitar el acceso en el interceptor si lo prefieren
    localStorage.setItem('token', token);

    return user;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const logout = () => {
  console.log('Cerrando sesión, eliminando token');
  localStorage.removeItem('user');
  localStorage.removeItem('token');
};

export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  }
  return null;
};