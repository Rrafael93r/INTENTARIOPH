import axios from 'axios';

const API_URL = 'http://localhost:8080/api/impresorasPos';

export const getImpresorasPos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Impresoras POS:', error);
        throw error;
    }
};

export const getImpresoraPosById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Impresora POS:', error);
        throw error;
    }
};

export const createImpresoraPos = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating Impresora POS:', error);
        throw error;
    }
};

export const updateImpresoraPos = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Impresora POS:', error);
        throw error;
    }
};

export const deleteImpresoraPos = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Impresora POS:', error);
        throw error;
    }
};
