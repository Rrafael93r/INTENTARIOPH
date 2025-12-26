import axios from 'axios';

const API_URL = 'http://localhost:8080/api/roles';

export const getRoles = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

export const getRoleById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching role:', error);
        throw error;
    }
};
