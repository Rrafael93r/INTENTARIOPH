import axios from 'axios';

const API_URL = 'http://localhost:8080/api/hubusb';

export const getHubUsb = async () => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        console.error('Error fetching hub usb:', error);
        throw error;
    }
};

export const getHubUsbById = async (id: number) => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching hub usb:', error);
        throw error;
    }
};

export const createHubUsb = async (data: any) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error creating hub usb:', error);
        throw error;
    }
};

export const updateHubUsb = async (id: number, data: any) => {
    try {
        const response = await axios.put(`${API_URL}/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating hub usb:', error);
        throw error;
    }
};

export const deleteHubUsb = async (id: number) => {
    try {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting hub usb:', error);
        throw error;
    }
};
