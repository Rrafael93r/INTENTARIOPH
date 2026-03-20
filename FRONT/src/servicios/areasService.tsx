import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/api/areas';

export const getAreas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching areas:', error);
        throw error;
    }
};

export const getAreaById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching area:', error);
        throw error;
    }
};

export const createArea = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating area:', error);
        throw error;
    }
};

export const updateArea = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating area:', error);
        throw error;
    }
};

export const deleteArea = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting area:', error);
        throw error;
    }
};
