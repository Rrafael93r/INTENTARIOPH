import axios from 'axios';

const API_URL = 'http://localhost:8080/api/proveedorinternet';

// Obtener todos los proveedores
export const getProveedor_internet = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener proveedores:', error);
    throw error;
  }
};

// Eliminar un proveedor
export const deleteProveedor = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/softDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el proveedor:', error);
    throw error;
  }
};

// Crear un nuevo proveedor
export const createProveedor = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear el proveedor:', error);
    throw new Error('Error al crear el proveedor');
  }
};

export const getProveedorInternetById = async (id: number) => {
  const response = await axios.get(`http://localhost:8080/api/proveedorinternet/${id}`);
  return response.data;
};

export const updateProveedorInternet = async (id: number, proveedorData: any) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/proveedorinternet/${id}`, proveedorData);
    return response.data;
  } catch (error) {
    console.error('Error updating proveedor:', error);
    throw error; 
  }
}