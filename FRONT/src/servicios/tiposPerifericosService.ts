import axios from 'axios';

const API_URL = 'http://localhost:8080/api/tipos-perifericos';

export const getTiposPerifericos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching tipos de perifericos:', error);
        throw error;
    }
};

export const getTipoPerifericoById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching tipo de periferico:', error);
        throw error;
    }
};

export const createTipoPeriferico = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating tipo de periferico:', error);
        throw error;
    }
};

export const updateTipoPeriferico = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating tipo de periferico:', error);
        throw error;
    }
};

export const deleteTipoPeriferico = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting tipo de periferico:', error);
        throw error;
    }
};
