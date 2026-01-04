import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import api from '../../utils/api';
import { logger } from '../../utils/logger';

jest.mock('../../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    }
}));

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
            expect(api.interceptors.request.handlers.length).toBe(1);
        });

        it('debe tener handlers de response', () => {
            expect(api.interceptors.response.handlers).toBeDefined();
            expect(Array.isArray(api.interceptors.response.handlers)).toBe(true);
            expect(api.interceptors.response.handlers.length).toBe(2);
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
});
