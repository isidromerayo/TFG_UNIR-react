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
    if (!config) return Promise.reject(new Error(err.message));

    // Use a symbol to store retry count to avoid type conflicts
    const retryCount = config._retryCount || 0;
    
    if (retryCount >= RETRY_CONFIG.maxRetries) {
        return Promise.reject(new Error(err.message));
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
        return Promise.reject(new Error(error.message));
    }
);

// Add response interceptor for better error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // Server responded with error status
            logger.error('Error Response:', {
                url: error.config?.url,
                status: error.response.status,
                data: error.response.data
            });
        } else if (error.request) {
            // Request made but no response
            logger.error('Network Error:', {
                url: error.config?.url,
                message: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.'
            });
        } else {
            // Request setup error
            logger.error('Request Error:', {
                url: error.config?.url,
                message: error.message
            });
        }
        return Promise.reject(new Error(error.message));
    }
);

export default api;
