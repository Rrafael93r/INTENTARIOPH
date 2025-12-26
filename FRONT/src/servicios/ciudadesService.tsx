import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ciudades';

export const getCiudades = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching ciudades:', error);
        throw error;
    }
};

export const getCiudadById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching ciudad:', error);
        throw error;
    }
};

export const createCiudad = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating ciudad:', error);
        throw error;
    }
};

export const updateCiudad = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating ciudad:', error);
        throw error;
    }
};

export const deleteCiudad = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting ciudad:', error);
        throw error;
    }
};
