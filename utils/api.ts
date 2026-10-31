import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from './constants';
import { logger } from './logger';

interface ApiRetryConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
}

// Custom retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    retryDelay: 1000
};

// Only idempotent methods are retried (never POST/PUT/PATCH/DELETE)
const RETRYABLE_METHODS = new Set<string>(['get', 'head', 'options']);

// A failure is transient when no response was received (network level),
// when the server answers 429 (throttling) or with a 5xx status
const isTransientError = (error: AxiosError): boolean => {
    if (error.code === 'ERR_CANCELED') {
        return false;
    }
    if (!error.response) {
        return true;
    }
    return error.response.status === 429 || error.response.status >= 500;
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

// Retry transient failures of idempotent requests with incremental backoff
api.interceptors.response.use(undefined, async (err: AxiosError) => {
    const { config } = err;
    if (!config) {
        throw new Error(err.message);
    }

    const retryCount = (config as ApiRetryConfig)._retryCount || 0;
    const canRetry = retryCount < RETRY_CONFIG.maxRetries
        && RETRYABLE_METHODS.has((config.method || '').toLowerCase())
        && isTransientError(err);

    if (!canRetry) {
        throw err;
    }

    (config as ApiRetryConfig)._retryCount = retryCount + 1;
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

// Add response interceptor for better error handling:
// enriches the error message but preserves the original error
// (response, status, code) so pages can discriminate error kinds
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

        // Keep message readable while preserving response/status/code
        error.message = errorMessage;
        return Promise.reject(error);
    }
);

export default api;
