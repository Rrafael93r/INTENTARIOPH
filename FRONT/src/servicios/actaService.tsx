import axios from 'axios';

const API_URL = 'http://localhost:8080/api/actas';

export const getActas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Actas:', error);
        throw error;
    }
};

export const getActaById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Acta:', error);
        throw error;
    }
};

export const createActa = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating Acta:', error);
        throw error;
    }
};

export const updateActa = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Acta:', error);
        throw error;
    }
};

export const deleteActa = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Acta:', error);
        throw error;
    }
};
