import axios from 'axios';
import { API_URL } from './constants';
import { logger } from './logger';

// Custom retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000
};

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Accept': 'application/json, application/hal+json',
        'Content-Type': 'application/json'
    },
    withCredentials: false,
    timeout: 30000, // 30 seconds timeout
    validateStatus: (status) => {
        return status >= 200 && status < 300 || status === 304;
    }
});

// Add retry functionality to axios
api.interceptors.response.use(undefined, async (err) => {
    const { config } = err;
    if (!config) throw new Error(err.message);

    // Use a symbol to store retry count to avoid type conflicts
    const retryCount = config._retryCount || 0;
    
    if (retryCount >= RETRY_CONFIG.maxRetries) {
        throw new Error(err.message);
    }

    config._retryCount = retryCount + 1;
    const delayMs = RETRY_CONFIG.retryDelay * (retryCount + 1);
    
    await new Promise(resolve => setTimeout(resolve, delayMs));
    return api(config);
});

// Add request interceptor
api.interceptors.request.use(
    (config) => {
        // Add trailing slash if needed
        if (!config.url?.endsWith('/')) {
            logger.debug('URL:', config.url);
        }
        return config;
    },
    (error) => {
        logger.error('Request Error:', error);
        throw new Error(error.message);
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        let errorMessage;
        
        if (error.response) {
            // Server responded with error status
            errorMessage = error.response.data?.message || 'Server Error';
            logger.error('Error Response:', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // Request made but no response
            errorMessage = 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.';
            logger.error('Network Error:', {
                url: error.config?.url,
                message: errorMessage
            });
        } else {
            // Request setup error
            errorMessage = error.message || 'Request setup error';
            logger.error('Request Error:', {
                url: error.config?.url,
                message: errorMessage
            });
        }
        
        // Asignar el mensaje al error antes de lanzarlo
        error.message = errorMessage;
        throw new Error(errorMessage);
    }
);

export default api;
