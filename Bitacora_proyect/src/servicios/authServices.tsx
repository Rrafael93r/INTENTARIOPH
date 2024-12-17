import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

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
    const response = await axios.get(API_URL);
    const users = response.data;

    const user = users.find((u: any) =>
      u.username === username && u.password === password
    );

    if (!user) {
      //throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario tenga la estructura correcta antes de guardarlo
    if (!user.role || typeof user.role.id === 'undefined') {
      throw new Error('Estructura de usuario inválida');
    }

    // Guardar información del usuario en localStorage
    const userInfo = {
      id: user.id,
      username: user.username,
      roleId: user.role.id
    };

    localStorage.setItem('user', JSON.stringify(userInfo));
    return user;
  } catch (error) {
    //console.error('Error en login:', error);
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('user');
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