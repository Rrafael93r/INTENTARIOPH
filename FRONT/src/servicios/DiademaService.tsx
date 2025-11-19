import axios from 'axios';

const API_URL = 'http://localhost:8080/api/diademas';


export const getDiademas = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error al obtener las Diademas:', error);
        throw error;
    }
};

export const deleteDiademas = async (id: number) => {
    try {
        const response = await axios.put(`${API_URL}/softDelete/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error al eliminar la Diadema:', error);
        throw error;
    }
};


export const createDiademas = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error al crear la diadema:', error);
        throw new Error('Error al crear la diadema');
    }
};

export const getDiademaById = async (id: number) => {
    const response = await axios.get(`http://localhost:8080/api/diademas/${id}`);
    return response.data;
};

export const updateDiadema = async (id: number, diademaData: any) => {
    try {
        const response = await axios.put(`http://localhost:8080/api/diademas/${id}`, diademaData);
        return response.data;
    } catch (error) {
        console.error('Error updating base:', error);
        throw error;
    }
}