import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/api/impresoras';

export const getImpresoras = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching Impresoras:', error);
        throw error;
    }
};

export const getImpresoraById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Impresora:', error);
        throw error;
    }
};

export const createImpresora = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating Impresora:', error);
        throw error;
    }
};

export const updateImpresora = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating Impresora:', error);
        throw error;
    }
};

export const deleteImpresora = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting Impresora:', error);
        throw error;
    }
};
