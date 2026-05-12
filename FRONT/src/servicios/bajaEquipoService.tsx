import axios from './axiosConfig';

const BASE_URL = `${import.meta.env.VITE_API_URL}/bajas-equipos`;

export interface BajaEquipo {
    id?: number;
    tipoEquipo: string;
    equipoId?: number;
    serial?: string;
    marca?: string;
    modelo?: string;
    motivoBaja: string;
    fechaBaja: string;
    descripcion?: string;
    ultimoFuncionario?: { id: number; nombre?: string; apellido?: string };
    registradoPor?: { id: number; username?: string };
}

export const getBajasEquipos = async (): Promise<BajaEquipo[]> => {
    const res = await axios.get(BASE_URL);
    return res.data;
};

export const getBajaEquipoById = async (id: number): Promise<BajaEquipo> => {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data;
};

export const getBajasByRango = async (inicio: string, fin: string): Promise<BajaEquipo[]> => {
    const res = await axios.get(`${BASE_URL}/rango`, { params: { inicio, fin } });
    return res.data;
};

export const createBajaEquipo = async (data: BajaEquipo): Promise<BajaEquipo> => {
    const res = await axios.post(BASE_URL, data);
    return res.data;
};

export const updateBajaEquipo = async (id: number, data: BajaEquipo): Promise<BajaEquipo> => {
    const res = await axios.put(`${BASE_URL}/${id}`, data);
    return res.data;
};

export const deleteBajaEquipo = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/${id}`);
};
