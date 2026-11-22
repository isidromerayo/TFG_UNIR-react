import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Swal from 'sweetalert2';
import { getToken, removeToken, removeUser } from '../services/session';
import { API_URL } from './constants';
import { logger } from './logger';

interface ApiRetryConfig extends InternalAxiosRequestConfig {
    _retryCount?: number;
}

interface UrlConfig {
    url?: string;
    method?: string;
}

// Custom retry configuration
const RETRY_CONFIG = {
    maxRetries: 3,
    retryDelay: 500
};

// Only idempotent methods are retried (never POST/PUT/PATCH/DELETE)
const RETRYABLE_METHODS = new Set<string>(['get', 'head', 'options']);

// Rutas de catálogo (solo lectura) que el backend sirve sin token
const CATALOGO_PUBLICO = /^\/(categorias|cursos|valoraciones)([/?]|$)/;

/**
 * Path relativo a API_URL: las páginas pasan unas veces URLs absolutas
 * (`${API_URL}/...`) y otras relativas (`/usuarios/...`).
 */
const urlPath = (url?: string): string => {
    if (!url) {
        return '';
    }
    const sinBase = url.startsWith(API_URL) ? url.slice(API_URL.length) : url;
    return sinBase.startsWith('/') ? sinBase : `/${sinBase}`;
};

/**
 * Rutas a las que NO se añade la cabecera Authorization: login y alta de usuario
 * (POST públicos) y el catálogo de solo lectura. Enviar el token ahí es inocuo
 * pero provoca preflights CORS innecesarios.
 */
export function esRutaPublica(config: UrlConfig): boolean {
    const path = urlPath(config.url);
    const method = (config.method ?? '').toLowerCase();
    if (method === 'post' && (path === '/auth' || path === '/usuarios')) {
        return true;
    }
    return method === 'get' && CATALOGO_PUBLICO.test(path);
}

/** El 401/403 del login (POST /auth) lo muestra la página de acceso con su propio mensaje. */
const esLogin = (config?: UrlConfig): boolean =>
    !!config && (config.method ?? '').toLowerCase() === 'post' && urlPath(config.url) === '/auth';

/**
 * Redirige al login cuando la sesión caduca. Se expone como propiedad de un
 * objeto porque jsdom define `window.location` no configurable: así los tests
 * pueden sustituirla sin navegar de verdad. El guard de `window` mantiene el
 * módulo seguro para el código que corre en el servidor.
 */
export const sesionFallback = {
    redirigirAAcceso(): void {
        if (typeof window !== 'undefined') {
            window.location.assign('/acceso');
        }
    }
};

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

    const retryCount = (config as ApiRetryConfig)._retryCount ?? 0;
    const canRetry = retryCount < RETRY_CONFIG.maxRetries
        && RETRYABLE_METHODS.has((config.method ?? '').toLowerCase())
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

// Adjunta el JWT a las rutas protegidas. El token viaja en el body de
// AuthResponse (el backend nunca lo devuelve en cabecera), por lo que se
// descarta también el valor literal 'undefined' que guardó durante un
// tiempo el antiguo lector de cabeceras.
api.interceptors.request.use((config) => {
    const token = getToken();
    if (token && token !== 'undefined' && !esRutaPublica(config)) {
        config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
});

// Add response interceptor for better error handling:
// enriches the error message but preserves the original error
// (response, status, code) so pages can discriminate error kinds
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        let errorMessage: string;

        if (error.response) {
            // Server responded with error status
            const data = error.response.data as { message?: string } | undefined;
            errorMessage = data?.message ?? 'Server Error';
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
            errorMessage = error.message;
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

// Trata de forma centralizada los fallos de autorización en rutas protegidas:
//  - 401: cierra la sesión, avisa y redirige a /acceso (sesión caducada).
//  - 403: informa de falta de permisos sin cerrar la sesión (el `id` pedido no
//    casa con el del token).
// El 401/403 del login (POST /auth) NO se trata aquí: lo muestra la página de
// acceso con su propio mensaje de credenciales (se evita así el doble aviso).
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (!esLogin(error.config)) {
            const status = error.response?.status;
            if (status === 401) {
                removeToken();
                removeUser();
                Swal.fire('Sesión caducada', 'Su sesión ha expirado, vuelva a acceder', 'warning');
                sesionFallback.redirigirAAcceso();
            } else if (status === 403) {
                Swal.fire('Sin permisos', 'No tiene permiso para ver estos datos', 'error');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
