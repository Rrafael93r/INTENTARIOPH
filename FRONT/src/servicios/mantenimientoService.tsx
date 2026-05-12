import axios from './axiosConfig';

const BASE_URL = `${import.meta.env.VITE_API_URL}/mantenimientos`;

export interface Mantenimiento {
    id?: number;
    tipoEquipo: string;
    equipoId: number;
    tipoMantenimiento: string;
    descripcion: string;
    fecha: string;
    tecnico?: { id: number; nombre?: string; apellido?: string };
    costo?: number;
    resultado: string;
    observaciones?: string;
}

export const getMantenimientos = async (): Promise<Mantenimiento[]> => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

export const getMantenimientoById = async (id: number): Promise<Mantenimiento> => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const getMantenimientosPorEquipo = async (tipoEquipo: string, equipoId: number): Promise<Mantenimiento[]> => {
    const res = await axios.get(`${BASE_URL}/equipo`, { params: { tipoEquipo, equipoId } });
    return res.data;
};

export const createMantenimiento = async (data: Mantenimiento): Promise<Mantenimiento> => {
    const res = await axios.post(BASE_URL, data);
    return res.data;
};

export const updateMantenimiento = async (id: number, data: Mantenimiento): Promise<Mantenimiento> => {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
};

export const deleteMantenimiento = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
};
