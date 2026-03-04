import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pcComputadores'; // Corrected endpoint to match Controller

export const getPcEscritorios = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching PcEscritorios:', error);
        throw error;
    }
};

export const getPcEscritorioById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching PcEscritorio:', error);
        throw error;
    }
};

export const createPcEscritorio = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating PcEscritorio:', error);
        throw error;
    }
};

export const updatePcEscritorio = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating PcEscritorio:', error);
        throw error;
    }
};

export const deletePcEscritorio = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting PcEscritorio:', error);
        throw error;
    }
};
