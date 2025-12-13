import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';

// Necesitamos importar el logger después de mockear las variables de entorno
// Por eso usamos require dinámico
let logger: any;

describe('Logger', () => {
  const originalEnv = process.env;
  const originalConsole = {
    log: console.log,
    warn: console.warn,
    error: console.error,
    debug: console.debug,
  };

  beforeEach(() => {
    // Limpiar el módulo cache para poder reimportar con diferentes configuraciones
    jest.resetModules();
    // Mockear console methods
    console.log = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
  });

  afterEach(() => {
    // Restaurar entorno original
    process.env = originalEnv;
    // Restaurar console original
    console.log = originalConsole.log;
    console.warn = originalConsole.warn;
    console.error = originalConsole.error;
    console.debug = originalConsole.debug;
  });

  describe('en modo desarrollo', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        NODE_ENV: 'development',
      };
      logger = require('../../utils/logger').logger;
    });

    it('debe loggear mensajes en desarrollo', () => {
      logger.log('test log');
      expect(console.log).toHaveBeenCalledWith('test log');
    });

    it('debe loggear warnings en desarrollo', () => {
      logger.warn('test warn');
      expect(console.warn).toHaveBeenCalledWith('test warn');
    });

    it('debe loggear errors en desarrollo', () => {
      logger.error('test error');
      expect(console.error).toHaveBeenCalledWith('test error');
    });

    it('debe loggear debug en desarrollo', () => {
      logger.debug('test debug');
      expect(console.debug).toHaveBeenCalledWith('test debug');
    });

    it('debe aceptar múltiples argumentos', () => {
      logger.log('arg1', 'arg2', { key: 'value' });
      expect(console.log).toHaveBeenCalledWith('arg1', 'arg2', { key: 'value' });
    });
  });

  describe('en modo producción', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        NODE_ENV: 'production',
        NEXT_PUBLIC_ENABLE_LOGGING: undefined,
      };
      logger = require('../../utils/logger').logger;
    });

    it('no debe loggear en producción por defecto', () => {
      logger.log('test log');
      logger.warn('test warn');
      logger.error('test error');
      logger.debug('test debug');

      expect(console.log).not.toHaveBeenCalled();
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.error).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('debe loggear si NEXT_PUBLIC_ENABLE_LOGGING está activado', () => {
      process.env.NEXT_PUBLIC_ENABLE_LOGGING = 'true';
      jest.resetModules();
      logger = require('../../utils/logger').logger;

      logger.log('test log');
      expect(console.log).toHaveBeenCalledWith('test log');
    });
  });

  describe('niveles de log', () => {
    beforeEach(() => {
      process.env = {
        ...originalEnv,
        NODE_ENV: 'development',
      };
    });

    it('debe respetar el nivel de log "error"', () => {
      process.env.NEXT_PUBLIC_LOG_LEVEL = 'error';
      jest.resetModules();
      logger = require('../../utils/logger').logger;

      // Limpiar llamadas anteriores
      jest.clearAllMocks();

      logger.error('error message');
      logger.warn('warn message');
      logger.log('log message');
      logger.debug('debug message');

      expect(console.error).toHaveBeenCalledWith('error message');
      expect(console.warn).not.toHaveBeenCalled();
      expect(console.log).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('debe respetar el nivel de log "warn"', () => {
      process.env.NEXT_PUBLIC_LOG_LEVEL = 'warn';
      jest.resetModules();
      logger = require('../../utils/logger').logger;

      // Limpiar llamadas anteriores
      jest.clearAllMocks();

      logger.error('error message');
      logger.warn('warn message');
      logger.log('log message');
      logger.debug('debug message');

      expect(console.error).toHaveBeenCalledWith('error message');
      expect(console.warn).toHaveBeenCalledWith('warn message');
      expect(console.log).not.toHaveBeenCalled();
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('debe respetar el nivel de log "log"', () => {
      process.env.NEXT_PUBLIC_LOG_LEVEL = 'log';
      jest.resetModules();
      logger = require('../../utils/logger').logger;

      // Limpiar llamadas anteriores
      jest.clearAllMocks();

      logger.error('error message');
      logger.warn('warn message');
      logger.log('log message');
      logger.debug('debug message');

      expect(console.error).toHaveBeenCalledWith('error message');
      expect(console.warn).toHaveBeenCalledWith('warn message');
      expect(console.log).toHaveBeenCalledWith('log message');
      expect(console.debug).not.toHaveBeenCalled();
    });

    it('debe respetar el nivel de log "debug"', () => {
      process.env.NEXT_PUBLIC_LOG_LEVEL = 'debug';
      jest.resetModules();
      logger = require('../../utils/logger').logger;

      // Limpiar llamadas anteriores
      jest.clearAllMocks();

      logger.error('error message');
      logger.warn('warn message');
      logger.log('log message');
      logger.debug('debug message');

      expect(console.error).toHaveBeenCalledWith('error message');
      expect(console.warn).toHaveBeenCalledWith('warn message');
      expect(console.log).toHaveBeenCalledWith('log message');
      expect(console.debug).toHaveBeenCalledWith('debug message');
    });
  });
});

