import axios from 'axios';

const API_URL = 'http://localhost:8080/api/baseRefrigeradora';


export const getBaseRefrigeradora = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las Bases:', error);
    throw error;
  }
};

export const deleteBaseRefrigeradora = async (id: number) => {
  try {
    const response = await axios.put(`${API_URL}/softDelete/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar la Base:', error);
    throw error;
  }
};


export const createBaseRefrigeradora = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error al crear la base:', error);
    throw new Error('Error al crear la base');
  }
};

export const getBaseRefrigeradoraById = async (id: number) => {
  const response = await axios.get(`http://localhost:8080/api/baseRefrigeradora/${id}`);
  return response.data;
};

export const updateBaseRefrigeradora = async (id: number, baserefrigeradoraData: any) => {
  try {
    const response = await axios.put(`http://localhost:8080/api/baseRefrigeradora/${id}`, baserefrigeradoraData);
    return response.data;
  } catch (error) {
    console.error('Error updating base:', error);
    throw error;
  }
}