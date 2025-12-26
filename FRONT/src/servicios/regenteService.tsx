import axios from 'axios';

const API_URL = 'http://localhost:8080/api/regente';

export const getRegentes = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching regente:', error);
        throw error;
    }
};

export const getRegenteById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching regente:', error);
        throw error;
    }
};

export const createRegente = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating regente:', error);
        throw error;
    }
};

export const updateRegente = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating regente:', error);
        throw error;
    }
};

export const deleteRegente = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting regente:', error);
        throw error;
    }
};
