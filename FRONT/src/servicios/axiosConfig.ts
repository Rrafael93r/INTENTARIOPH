import axios from 'axios';

// Configurar interceptor globalmente
axios.interceptors.request.use(
    (config) => {
        // Obtener el token del localStorage
        const token = localStorage.getItem('token');

        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Opcional: mantener compatibilidad con endpoints públicos o migraciones graduales
            const apiKey = import.meta.env.VITE_API_KEY || 'pharmaser_secure_api_key_2024';
            if (apiKey && !config.headers['Authorization']) {
                config.headers['x-api-key'] = apiKey;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Manejo global de errores (opcional, pero útil)
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error);
    }
);

export default axios;
