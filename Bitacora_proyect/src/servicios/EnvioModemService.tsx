import axios from 'axios';

const API_URL = 'http://localhost:8080/api/enviosmodems';

export const getEnvios = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching envíos:', error);
    throw error;
  }
};

export const createEnvio = async (data: any) => {
  try {
    const response = await axios.post(API_URL, data);
    return response.data;
  } catch (error) {
    console.error('Error creating envío:', error);
    throw error;
  }
};

export const updateEnvio = async (id: number, data: any) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating envío:', error);
    throw error;
  }
};

export const deleteEnvio = async (id: number) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting envío:', error);
    throw error;
  }
};

export const getEnvioById = async (id: number) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching envío by id:', error);
    throw error;
  }
};