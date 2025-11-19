import axios from 'axios';

const API_URL = 'http://localhost:8080/api/farmacia';

// TRAER LOS FARMACIAS
export const getFarmacias = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching farmacias:', error);
    throw error;
  }
};

//ELIMINAR 

export const deleteFarmacia = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/softDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar farmacia:', error);
    throw error;
  }
};

export const createFarmacia = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la farmacia:', error);
    throw new Error('Error al crear la farmacia');
  }
};

export const getFarmaciaById = async (id: number) => {
  const response = await axios.get(`http://localhost:8080/api/farmacia/${id}`);
  return response.data;
};

export const updateFarmacia = async (id: number, farmaciaData: any) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/farmacia/${id}`, farmaciaData);
    return response.data;
  } catch (error) {
    console.error('Error al actualizar Farmacia:', error);
    throw error;
  }
}