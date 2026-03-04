import axios from 'axios';

const API_URL = 'http://localhost:8080/api/marcas';

export const getMarcas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching marcas:', error);
        throw error;
    }
};

export const getMarcaById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching marca:', error);
        throw error;
    }
};

export const createMarca = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating marca:', error);
        throw error;
    }
};

export const updateMarca = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating marca:', error);
        throw error;
    }
};

export const deleteMarca = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting marca:', error);
        throw error;
    }
};
