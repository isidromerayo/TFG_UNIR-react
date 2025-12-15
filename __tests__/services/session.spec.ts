import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '../../services/session';
import { TOKEN, USER } from '../../utils/constants';

jest.mock('../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  },
}));

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

describe('Session Service', () => {
  const mockToken = 'test-token-123';
  const mockUser = { id: 1, nombre: 'Usuario de Prueba', email: 'test@example.com' };
  const mockUserString = JSON.stringify(mockUser);

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('Token Management', () => {
    it('debe guardar un token en localStorage', () => {
      setToken(mockToken);
      expect(localStorage.getItem(TOKEN)).toBe(mockToken);
    });

    it('debe obtener un token de localStorage', () => {
      localStorage.setItem(TOKEN, mockToken);
      const token = getToken();
      expect(token).toBe(mockToken);
    });

    it('debe devolver una cadena vacía cuando no hay ventana (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore - simular SSR
      delete (global as any).window;

      const token = getToken();
      expect(token).toBe('');

      global.window = originalWindow;
    });

    it('debe eliminar un token de localStorage', () => {
      localStorage.setItem(TOKEN, mockToken);
      removeToken();
      expect(localStorage.getItem(TOKEN)).toBeNull();
    });
  });

  describe('User Management', () => {
    it('debe guardar un usuario en localStorage', () => {
      setUser(mockUserString);
      expect(localStorage.getItem(USER)).toBe(mockUserString);
    });

    it('debe obtener un usuario de localStorage', () => {
      localStorage.setItem(USER, mockUserString);
      const user = getUser();
      expect(user).toEqual(mockUser);
    });

    it('debe devolver null cuando no hay usuario', () => {
      const user = getUser();
      expect(user).toBeNull();
    });

    it('debe devolver null cuando no hay ventana (SSR)', () => {
      const originalWindow = global.window;
      // @ts-ignore - simular SSR
      delete (global as any).window;

      const user = getUser();
      expect(user).toBeNull();

      global.window = originalWindow;
    });

    it('debe manejar correctamente un JSON de usuario inválido', () => {
      localStorage.setItem(USER, '{invalid-json');
      const user = getUser();
      expect(user).toBeNull();
    });

    it('debe eliminar un usuario de localStorage', () => {
      localStorage.setItem(USER, mockUserString);
      removeUser();
      expect(localStorage.getItem(USER)).toBeNull();
    });
  });
});
