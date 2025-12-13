import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

describe('Constants', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('debe usar NEXT_PUBLIC_API_URL de las variables de entorno', () => {
    process.env.NEXT_PUBLIC_API_URL = 'https://api.example.com';
    jest.resetModules();
    
    const { API_URL } = require('../../utils/constants');
    expect(API_URL).toBe('https://api.example.com');
  });

  it('debe usar el valor por defecto si NEXT_PUBLIC_API_URL no está definido', () => {
    delete process.env.NEXT_PUBLIC_API_URL;
    jest.resetModules();
    
    const { API_URL } = require('../../utils/constants');
    expect(API_URL).toBe('http://localhost:8080/api');
  });

  it('debe exportar las constantes de localStorage correctamente', () => {
    const { TOKEN, USER, CART } = require('../../utils/constants');
    
    expect(TOKEN).toBe('token');
    expect(USER).toBe('usuario');
    expect(CART).toBe('cart');
  });
});

