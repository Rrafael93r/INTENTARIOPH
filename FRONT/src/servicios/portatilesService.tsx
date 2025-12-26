import axios from 'axios';

// Note: Backend endpoint uses capitalized 'Portatiles'
const API_URL = 'http://localhost:8080/api/Portatiles';

export const getPortatiles = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching portatiles:', error);
        throw error;
    }
};

export const getPortatilById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching portatil:', error);
        throw error;
    }
};

export const createPortatil = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating portatil:', error);
        throw error;
    }
};

export const updatePortatil = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating portatil:', error);
        throw error;
    }
};

export const deletePortatil = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting portatil:', error);
        throw error;
    }
};
