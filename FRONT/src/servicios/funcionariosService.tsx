import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/api/funcionarios';

export const getFuncionarios = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching funcionarios:', error);
        throw error;
    }
};

export const getFuncionarioById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching funcionario:', error);
        throw error;
    }
};

export const createFuncionario = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating funcionario:', error);
        throw error;
    }
};

export const updateFuncionario = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating funcionario:', error);
        throw error;
    }
};

export const deleteFuncionario = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting funcionario:', error);
        throw error;
    }
};
