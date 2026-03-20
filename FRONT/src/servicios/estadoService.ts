import axios from './axiosConfig';

const API_URL = 'http://localhost:8080/estados';

export const getEstados = async () => {
    const response = await axios.get(API_URL);
    return response.data;
};

export const createEstado = async (estado: any) => {
    const response = await axios.post(API_URL, estado);
    return response.data;
};

export const updateEstado = async (id: number, estado: any) => {
    const response = await axios.put(`${API_URL}/${id}`, estado);
    return response.data;
};

export const deleteEstado = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};

export const getEstadoById = async (id: number) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};
