import axios from './axiosConfig';

const API_URL = `${import.meta.env.VITE_API_URL}/chat`;

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export interface ChatRequest {
    messages: ChatMessage[];
    model?: string;
}

export interface ChatResponse {
    model: string;
    message: ChatMessage;
    done: boolean;
}

export const sendMessage = async (data: ChatRequest): Promise<ChatResponse> => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error('Error sending message to AI:', error);
        throw error;
    }
};
