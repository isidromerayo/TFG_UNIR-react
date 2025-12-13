import { describe, it, expect, beforeEach, jest } from '@jest/globals';
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
      // validateStatus es una función, verificamos que existe
      expect(api.defaults.validateStatus).toBeDefined();
      expect(typeof api.defaults.validateStatus).toBe('function');
      
      // Verificamos que acepta códigos 200-299 y 304
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

  describe('Logger Integration', () => {
    it('debe tener logger disponible para uso en interceptors', () => {
      // Verificamos que el logger está mockeado y disponible
      expect(logger).toBeDefined();
      expect(logger.error).toBeDefined();
      expect(logger.debug).toBeDefined();
    });
  });
});

