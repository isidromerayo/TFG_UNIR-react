import { AxiosHeaders } from 'axios';
import api, { sesionFallback } from '../../utils/api';
import { API_URL } from '../../utils/constants';
import { setToken, setUser } from '../../services/session';
import { logger } from '../../utils/logger';

jest.mock('../../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    }
}));

jest.mock('sweetalert2', () => ({
    __esModule: true,
    default: {
        fire: jest.fn(),
    }
}));

const mockSwalFire = jest.requireMock<{ default: { fire: jest.Mock } }>('sweetalert2').default.fire;

describe('API Utils', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('API Configuration', () => {
        it('debe tener la configuración base correcta', () => {
            expect(api.defaults.baseURL).toBeDefined();
            expect(api.defaults.timeout).toBe(30000);
            expect(api.defaults.headers['Accept']).toBe('application/json, application/hal+json');
            expect(api.defaults.headers['Content-Type']).toBe('application/json');
        });

        it('debe tener validateStatus configurado correctamente', () => {
            expect(api.defaults.validateStatus).toBeDefined();
            expect(typeof api.defaults.validateStatus).toBe('function');
            
            const validateStatus = api.defaults.validateStatus as (status: number) => boolean;
            expect(validateStatus(200)).toBe(true);
            expect(validateStatus(299)).toBe(true);
            expect(validateStatus(304)).toBe(true);
            expect(validateStatus(400)).toBe(false);
            expect(validateStatus(500)).toBe(false);
        });

        it('debe tener withCredentials configurado como false', () => {
            expect(api.defaults.withCredentials).toBe(false);
        });

        it('debe tener interceptors configurados', () => {
            expect(api.interceptors.request).toBeDefined();
            expect(api.interceptors.response).toBeDefined();
        });
    });

    describe('API Instance', () => {
        it('debe ser una instancia de axios', () => {
            expect(api).toBeDefined();
            expect(typeof api.get).toBe('function');
            expect(typeof api.post).toBe('function');
            expect(typeof api.put).toBe('function');
            expect(typeof api.delete).toBe('function');
            expect(typeof api.patch).toBe('function');
        });

        it('debe tener configuración de retry', () => {
            expect(api.interceptors.response.handlers.length).toBeGreaterThan(0);
            expect(api.interceptors.request.handlers.length).toBeGreaterThan(0);
        });
    });

    describe('Logger Integration', () => {
        it('debe tener logger disponible', () => {
            expect(logger).toBeDefined();
            expect(logger.error).toBeDefined();
            expect(logger.debug).toBeDefined();
            expect(logger.log).toBeDefined();
            expect(logger.warn).toBeDefined();
        });
    });

    describe('Interceptors Structure', () => {
        it('debe tener handlers de request', () => {
            expect(api.interceptors.request.handlers).toBeDefined();
            expect(Array.isArray(api.interceptors.request.handlers)).toBe(true);
            expect(api.interceptors.request.handlers.length).toBe(2);
        });

        it('debe tener handlers de response', () => {
            expect(api.interceptors.response.handlers).toBeDefined();
            expect(Array.isArray(api.interceptors.response.handlers)).toBe(true);
            expect(api.interceptors.response.handlers.length).toBe(3);
        });
    });

    describe('Constants and Configuration', () => {
        it('debe tener headers configurados', () => {
            expect(api.defaults.headers).toBeDefined();
            expect(typeof api.defaults.headers).toBe('object');
        });

        it('debe tener timeout configurado', () => {
            expect(api.defaults.timeout).toBe(30000);
        });

        it('debe tener baseURL configurado', () => {
            expect(api.defaults.baseURL).toBeDefined();
            expect(typeof api.defaults.baseURL).toBe('string');
        });
    });

    describe('ValidateStatus Function Coverage', () => {
        it('debe manejar diferentes códigos de estado', () => {
            const validateStatus = api.defaults.validateStatus as (status: number) => boolean;
            
            // Códigos de éxito
            expect(validateStatus(200)).toBe(true);
            expect(validateStatus(201)).toBe(true);
            expect(validateStatus(204)).toBe(true);
            expect(validateStatus(299)).toBe(true);
            expect(validateStatus(304)).toBe(true);
            
            // Códigos de error
            expect(validateStatus(400)).toBe(false);
            expect(validateStatus(401)).toBe(false);
            expect(validateStatus(404)).toBe(false);
            expect(validateStatus(500)).toBe(false);
            expect(validateStatus(502)).toBe(false);
        });
    });

    describe('Headers Configuration Coverage', () => {
        it('debe tener todos los headers configurados', () => {
            expect(api.defaults.headers['Accept']).toBe('application/json, application/hal+json');
            expect(api.defaults.headers['Content-Type']).toBe('application/json');
        });
    });

    describe('Request Interceptor - Handler Functions', () => {
        it('debe tener handler fulfilled', () => {
            expect(api.interceptors.request.handlers[0]).toBeDefined();
            expect(typeof api.interceptors.request.handlers[0].fulfilled).toBe('function');
        });

        it('debe tener handler rejected', () => {
            expect(api.interceptors.request.handlers[0]).toBeDefined();
            expect(typeof api.interceptors.request.handlers[0].rejected).toBe('function');
        });

        it('debe loguear y lanzar error en request rejected', () => {
            const requestHandler = api.interceptors.request.handlers[0];
            const error = new Error('request failed');

            const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);

            expect(() => requestHandler.rejected(error)).toThrow('request failed');

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Response Interceptor - Handler Functions', () => {
        it('debe tener primer handler', () => {
            expect(api.interceptors.response.handlers[0]).toBeDefined();
            expect(typeof api.interceptors.response.handlers[0]).toBe('object');
        });

        it('debe tener segundo handler', () => {
            expect(api.interceptors.response.handlers[1]).toBeDefined();
            expect(typeof api.interceptors.response.handlers[1]).toBe('object');
        });
    });

    describe('API Methods Coverage', () => {
        it('debe tener todos los métodos HTTP disponibles', () => {
            expect(typeof api.get).toBe('function');
            expect(typeof api.post).toBe('function');
            expect(typeof api.put).toBe('function');
            expect(typeof api.delete).toBe('function');
            expect(typeof api.patch).toBe('function');
            expect(typeof api.head).toBe('function');
            expect(typeof api.options).toBe('function');
        });
    });

    describe('Interceptors Request Coverage', () => {
        it('debe tener estructura de request interceptor', () => {
            expect(api.interceptors.request).toBeDefined();
            expect(typeof api.interceptors.request.use).toBe('function');
            expect(typeof api.interceptors.request.eject).toBe('function');
        });
    });

    describe('Interceptors Response Coverage', () => {
        it('debe tener estructura de response interceptor', () => {
            expect(api.interceptors.response).toBeDefined();
            expect(typeof api.interceptors.response.use).toBe('function');
            expect(typeof api.interceptors.response.eject).toBe('function');
        });
    });

    describe('Retry Interceptor - Minimal Behavior', () => {
        it('debe lanzar error cuando no existe config en el error', async () => {
            const retryHandler = api.interceptors.response.handlers[0];
            expect(retryHandler).toBeDefined();
            expect(typeof retryHandler.rejected).toBe('function');

            await expect(retryHandler.rejected({ message: 'boom' })).rejects.toThrow('boom');
        });
    });

    describe('Request Interceptor - URL Handling', () => {
        it('debe manejar URL sin trailing slash en request interceptor', async () => {
            const requestHandler = api.interceptors.request.handlers[0];
            expect(requestHandler).toBeDefined();
            expect(typeof requestHandler.fulfilled).toBe('function');

            const config = { url: 'api/cursos' };
            const result = await requestHandler.fulfilled(config);
            
            expect(result).toBe(config);
        });
    });

    describe('Response Interceptor - Success Path', () => {
        it('debe manejar respuesta exitosa en response interceptor', async () => {
            const responseHandler = api.interceptors.response.handlers[1];
            expect(responseHandler).toBeDefined();
            expect(typeof responseHandler.fulfilled).toBe('function');

            const mockResponse = { data: { success: true }, status: 200 };
            const result = await responseHandler.fulfilled(mockResponse);
            
            expect(result).toBe(mockResponse);
        });
    });

    describe('Response Interceptor - Error Path', () => {
        it('debe manejar error de servidor en response interceptor', async () => {
            const responseHandler = api.interceptors.response.handlers[1];
            expect(responseHandler).toBeDefined();
            expect(typeof responseHandler.rejected).toBe('function');

            const serverError = {
                response: { status: 500, data: { message: 'Server Error' } },
                config: { url: 'api/cursos' }
            };

            try {
                await responseHandler.rejected(serverError);
                fail('Expected error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Server Error');
            }
        });

        it('debe manejar error de red en response interceptor', async () => {
            const responseHandler = api.interceptors.response.handlers[1];
            expect(responseHandler).toBeDefined();
            expect(typeof responseHandler.rejected).toBe('function');

            const networkError = {
                request: {},
                config: { url: 'api/cursos' }
            };

            try {
                await responseHandler.rejected(networkError);
                fail('Expected error to be thrown');
            } catch (error) {
                expect(error.message).toBe('No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.');
            }
        });

        it('debe manejar error de configuración en response interceptor', async () => {
            const responseHandler = api.interceptors.response.handlers[1];
            expect(responseHandler).toBeDefined();
            expect(typeof responseHandler.rejected).toBe('function');

            const configError = {
                message: 'Request failed',
                config: { url: 'api/cursos' }
            };

            try {
                await responseHandler.rejected(configError);
                fail('Expected error to be thrown');
            } catch (error) {
                expect(error.message).toBe('Request failed');
            }
        });
    });
});

describe('Auth request interceptor', () => {
    const authorizationFor = async (url: string, method: string): Promise<unknown> => {
        const config = { url, method, headers: new AxiosHeaders() };
        const fulfilled = api.interceptors.request.handlers[1].fulfilled as (c: typeof config) => typeof config;
        const result = await fulfilled(config);
        return result.headers.get('Authorization');
    };

    beforeEach(() => {
        localStorage.clear();
    });

    it('añade Authorization: Bearer <token> en rutas protegidas (URL relativa y absoluta)', async () => {
        setToken('jwt-123');
        expect(await authorizationFor('/usuarios/1/cursos', 'get')).toBe('Bearer jwt-123');
        expect(await authorizationFor(`${API_URL}/usuarios/1/cursos`, 'get')).toBe('Bearer jwt-123');
        expect(await authorizationFor(`${API_URL}/usuarios/1/misCursosComprados`, 'post')).toBe('Bearer jwt-123');
    });

    it('omite la cabecera en POST /auth y POST /usuarios (login y alta públicos)', async () => {
        setToken('jwt-123');
        expect(await authorizationFor(`${API_URL}/auth`, 'post')).toBeUndefined();
        expect(await authorizationFor(`${API_URL}/usuarios`, 'post')).toBeUndefined();
        expect(await authorizationFor('/auth', 'post')).toBeUndefined();
    });

    it('omite la cabecera en los GET públicos de catálogo', async () => {
        setToken('jwt-123');
        expect(await authorizationFor(`${API_URL}/categorias?sort=nombre`, 'get')).toBeUndefined();
        expect(await authorizationFor('categorias', 'get')).toBeUndefined();
        expect(await authorizationFor(`${API_URL}/cursos/search/selectMorePoints`, 'get')).toBeUndefined();
        expect(await authorizationFor(`${API_URL}/valoraciones/5`, 'get')).toBeUndefined();
    });

    it('omite la cabecera cuando no hay token o vale literalmente undefined', async () => {
        expect(await authorizationFor('/usuarios/1/cursos', 'get')).toBeUndefined();
        setToken('undefined');
        expect(await authorizationFor('/usuarios/1/cursos', 'get')).toBeUndefined();
    });
});

describe('Sesion response interceptor (401/403 en rutas protegidas)', () => {
    const rejectedError = (error: Record<string, unknown>): Promise<unknown> => {
        const rejected = api.interceptors.response.handlers[2].rejected as (e: unknown) => Promise<unknown>;
        return rejected(error);
    };

    const originalRedirect = sesionFallback.redirigirAAcceso;
    const mockRedirect = jest.fn();

    beforeEach(() => {
        localStorage.clear();
        mockRedirect.mockClear();
        mockSwalFire.mockClear();
        // jsdom define window.location como no configurable: se sustituye
        // el seam de redirección del módulo en lugar de mockear el navegador
        sesionFallback.redirigirAAcceso = mockRedirect;
    });

    afterAll(() => {
        sesionFallback.redirigirAAcceso = originalRedirect;
    });

    it('un 401 en ruta protegida limpia la sesión, avisa y redirige a /acceso', async () => {
        setToken('jwt-123');
        setUser('{"id":1}');

        const error = { response: { status: 401, data: {} }, config: { method: 'get', url: '/usuarios/1/cursos' } };
        await expect(rejectedError(error)).rejects.toBe(error);

        expect(localStorage.getItem('token')).toBeNull();
        expect(localStorage.getItem('usuario')).toBeNull();
        expect(mockSwalFire).toHaveBeenCalledWith('Sesión caducada', 'Su sesión ha expirado, vuelva a acceder', 'warning');
        expect(mockRedirect).toHaveBeenCalled();
    });

    it('un 401 en el POST /auth NO cierra sesión ni redirige: lo muestra la página de acceso', async () => {
        setToken('jwt-123');

        const error = { response: { status: 401, data: {} }, config: { method: 'post', url: `${API_URL}/auth` } };
        await expect(rejectedError(error)).rejects.toBe(error);

        expect(localStorage.getItem('token')).toBe('jwt-123');
        expect(mockSwalFire).not.toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('un 403 avisa de falta de permisos sin cerrar la sesión', async () => {
        setToken('jwt-123');

        const error = { response: { status: 403, data: {} }, config: { method: 'get', url: '/usuarios/9/cursos' } };
        await expect(rejectedError(error)).rejects.toBe(error);

        expect(localStorage.getItem('token')).toBe('jwt-123');
        expect(mockSwalFire).toHaveBeenCalledWith('Sin permisos', 'No tiene permiso para ver estos datos', 'error');
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('no interviene en otros estados ni sin respuesta (red)', async () => {
        const notFound = { response: { status: 404, data: {} }, config: { method: 'get', url: '/usuarios/1/cursos' } };
        await expect(rejectedError(notFound)).rejects.toBe(notFound);

        const network = { config: { method: 'get', url: '/usuarios/1/cursos' } };
        await expect(rejectedError(network)).rejects.toBe(network);

        expect(mockSwalFire).not.toHaveBeenCalled();
        expect(mockRedirect).not.toHaveBeenCalled();
    });

    it('la implementación real de la redirección usa window.location sin romper el entorno de test', () => {
        // jsdom no navega: registra el intento como jsdomError en console.error
        const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
        try {
            expect(() => originalRedirect()).not.toThrow();
        } finally {
            consoleErrorSpy.mockRestore();
        }
    });
});
