import axios from 'axios';

// Note: Backend endpoint uses capitalized 'Mouses'
const API_URL = 'http://localhost:8080/api/Mouses';

export const getMouses = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching mouses:', error);
        throw error;
    }
};

export const getMouseById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching mouse:', error);
        throw error;
    }
};

export const createMouse = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating mouse:', error);
        throw error;
    }
};

export const updateMouse = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating mouse:', error);
        throw error;
    }
};

export const deleteMouse = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting mouse:', error);
        throw error;
    }
};
