import axios from 'axios';

const API_URL = 'http://localhost:8080/api/teclados';

export const getTeclados = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching teclados:', error);
        throw error;
    }
};

export const getTecladoById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching teclado:', error);
        throw error;
    }
};

export const createTeclado = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating teclado:', error);
        throw error;
    }
};

export const updateTeclado = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating teclado:', error);
        throw error;
    }
};

export const deleteTeclado = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting teclado:', error);
        throw error;
    }
};
