import axios from 'axios';

const API_URL = 'http://localhost:8080/api/departamentos';

export const getDepartamentos = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching departamentos:', error);
        throw error;
    }
};

export const getDepartamentoById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departamento:', error);
        throw error;
    }
};

export const createDepartamento = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating departamento:', error);
        throw error;
    }
};

export const updateDepartamento = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating departamento:', error);
        throw error;
    }
};

export const deleteDepartamento = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting departamento:', error);
        throw error;
    }
};
