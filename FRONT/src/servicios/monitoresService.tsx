import axios from 'axios';

const API_URL = 'http://localhost:8080/api/monitores';

export const getMonitores = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching monitores:', error);
        throw error;
    }
};

export const getMonitorById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching monitor:', error);
        throw error;
    }
};

export const createMonitor = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating monitor:', error);
        throw error;
    }
};

export const updateMonitor = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating monitor:', error);
        throw error;
    }
};

export const deleteMonitor = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting monitor:', error);
        throw error;
    }
};
