import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/api/perifericos';

export const getPerifericos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching perifericos:', error);
        throw error;
    }
};

export const getPerifericoById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching periferico:', error);
        throw error;
    }
};

export const createPeriferico = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating periferico:', error);
        throw error;
    }
};

export const updatePeriferico = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating periferico:', error);
        throw error;
    }
};

export const deletePeriferico = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting periferico:', error);
        throw error;
    }
};
