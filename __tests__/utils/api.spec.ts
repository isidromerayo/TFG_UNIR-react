import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import axios from 'axios';
import api from '../../utils/api';
import { logger } from '../../utils/logger';

// Mock del logger
jest.mock('../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }
}));

// Mock de axios para controlar las respuestas
jest.mock('axios');

describe('API Utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Request Interceptor', () => {
    it('debe usar logger.debug cuando la URL no termina en /', async () => {
      const mockAxios = axios as jest.Mocked<typeof axios>;
      const mockRequest = jest.fn().mockResolvedValue({ data: {} });
      mockAxios.create = jest.fn(() => ({
        ...api,
        request: mockRequest,
        interceptors: {
          request: {
            use: jest.fn(),
          },
          response: {
            use: jest.fn(),
          },
        },
      })) as any;

      // Simulamos una petición
      const config = { url: 'test-url', method: 'get' };
      const requestInterceptor = api.interceptors.request.handlers[0];
      
      if (requestInterceptor && requestInterceptor.fulfilled) {
        requestInterceptor.fulfilled(config);
      }

      // Verificamos que se llamó a logger.debug
      expect(logger.debug).toHaveBeenCalledWith('URL:', 'test-url');
    });

    it('debe usar logger.error en caso de error en el request', () => {
      const error = new Error('Request error');
      const requestInterceptor = api.interceptors.request.handlers[0];
      
      if (requestInterceptor && requestInterceptor.rejected) {
        try {
          requestInterceptor.rejected(error);
        } catch (e) {
          // Esperado que lance error
        }
      }

      expect(logger.error).toHaveBeenCalledWith('Request Error:', error);
    });
  });

  describe('Response Interceptor', () => {
    it('debe retornar la respuesta exitosa sin modificar', () => {
      const response = { data: { test: 'data' }, status: 200 };
      const responseInterceptor = api.interceptors.response.handlers[0];
      
      if (responseInterceptor && responseInterceptor.fulfilled) {
        const result = responseInterceptor.fulfilled(response);
        expect(result).toEqual(response);
      }
    });

    it('debe usar logger.error cuando hay error de respuesta del servidor', () => {
      const error = {
        response: {
          status: 404,
          data: { message: 'Not found' }
        },
        config: { url: '/test' },
        message: 'Request failed'
      };
      
      const responseInterceptor = api.interceptors.response.handlers[1];
      
      if (responseInterceptor && responseInterceptor.rejected) {
        try {
          responseInterceptor.rejected(error);
        } catch (e) {
          // Esperado que lance error
        }
      }

      expect(logger.error).toHaveBeenCalledWith('Error Response:', {
        url: '/test',
        status: 404,
        data: { message: 'Not found' }
      });
    });

    it('debe usar logger.error cuando hay error de red', () => {
      const error = {
        request: {},
        config: { url: '/test' },
        message: 'Network Error'
      };
      
      const responseInterceptor = api.interceptors.response.handlers[1];
      
      if (responseInterceptor && responseInterceptor.rejected) {
        try {
          responseInterceptor.rejected(error);
        } catch (e) {
          // Esperado que lance error
        }
      }

      expect(logger.error).toHaveBeenCalledWith('Network Error:', {
        url: '/test',
        message: 'No se pudo conectar con el servidor. Por favor, verifique su conexión a internet.'
      });
    });

    it('debe usar logger.error cuando hay error en la configuración del request', () => {
      const error = {
        message: 'Config error',
        config: { url: '/test' }
      };
      
      const responseInterceptor = api.interceptors.response.handlers[1];
      
      if (responseInterceptor && responseInterceptor.rejected) {
        try {
          responseInterceptor.rejected(error);
        } catch (e) {
          // Esperado que lance error
        }
      }

      expect(logger.error).toHaveBeenCalledWith('Request Error:', {
        url: '/test',
        message: 'Config error'
      });
    });
  });

  describe('API Configuration', () => {
    it('debe tener la configuración base correcta', () => {
      expect(api.defaults.baseURL).toBeDefined();
      expect(api.defaults.timeout).toBe(30000);
      expect(api.defaults.headers['Accept']).toBe('application/json, application/hal+json');
      expect(api.defaults.headers['Content-Type']).toBe('application/json');
    });

    it('debe tener validateStatus configurado correctamente', () => {
      // validateStatus es una función, verificamos que existe
      expect(api.defaults.validateStatus).toBeDefined();
      expect(typeof api.defaults.validateStatus).toBe('function');
    });
  });
});

