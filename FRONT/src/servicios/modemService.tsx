import axios from 'axios';

const API_URL = 'http://localhost:8080/api/modems';

export const getModems = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching modems:', error);
    throw error;
  }
};

export const updateModemStatus = async (id: number, estado: string) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/estado`, { estado });
    return response.data;
  } catch (error) {
    console.error('Error updating modem status:', error);
    throw error;
  }
};

//ELIMINAR 
export const deleteModems = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/softDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el modem:', error);
    throw error;
  }
};

export const createModems = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la modem:', error);
    throw new Error('Error al crear la modem');
  }
};

export const getModemById = async (id: number) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateModem = async (id: number, modemData: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, modemData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar Modem:', error);
    throw error;
  }
}