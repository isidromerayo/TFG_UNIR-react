import { setToken, getToken, removeToken, setUser, getUser, removeUser } from '../../services/session';
import { TOKEN, USER } from '../../utils/constants';

// Mock de localStorage
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
    }
  };
})();

// Mock de window
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true
});

describe('Session Service', () => {
  const mockToken = 'test-token-123';
  const mockUser = { id: 1, nombre: 'Usuario de Prueba', email: 'test@example.com' };
  const mockUserString = JSON.stringify(mockUser);

  // Limpiar localStorage antes de cada prueba
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
      // Primero guardamos el token
      localStorage.setItem(TOKEN, mockToken);
      
      // Luego lo recuperamos
      const token = getToken();
      expect(token).toBe(mockToken);
    });

    it('debe devolver una cadena vacía cuando no hay ventana (SSR)', () => {
      // Guardamos el objeto window original
      const originalWindow = global.window;
      // @ts-ignore - Simulamos que window no está definido
      delete global.window;
      
      const token = getToken();
      expect(token).toBe('');
      
      // Restauramos window
      global.window = originalWindow;
    });

    it('debe eliminar un token de localStorage', () => {
      // Primero guardamos el token
      localStorage.setItem(TOKEN, mockToken);
      
      // Luego lo eliminamos
      removeToken();
      
      // Verificamos que ya no existe
      expect(localStorage.getItem(TOKEN)).toBeNull();
    });
  });

  describe('User Management', () => {
    it('debe guardar un usuario en localStorage', () => {
      setUser(mockUserString);
      expect(localStorage.getItem(USER)).toBe(mockUserString);
    });

    it('debe obtener un usuario de localStorage', () => {
      // Primero guardamos el usuario
      localStorage.setItem(USER, mockUserString);
      
      // Luego lo recuperamos
      const user = getUser();
      expect(user).toEqual(mockUser);
    });

    it('debe devolver null cuando no hay usuario', () => {
      const user = getUser();
      expect(user).toBeNull();
    });

    it('debe devolver null cuando no hay ventana (SSR)', () => {
      // Guardamos el objeto window original
      const originalWindow = global.window;
      // @ts-ignore - Simulamos que window no está definido
      delete global.window;
      
      const user = getUser();
      expect(user).toBeNull();
      
      // Restauramos window
      global.window = originalWindow;
    });

    it('debe manejar correctamente un JSON de usuario inválido', () => {
      // Mock del logger para evitar mostrar el error en la consola
      jest.mock('../../utils/logger', () => ({
        logger: {
          error: jest.fn()
        }
      }));
      
      // Guardamos un JSON inválido
      localStorage.setItem(USER, '{invalid-json');
      
      // Verificamos que se maneje el error correctamente
      // getUser() debe retornar null cuando hay un error de parsing
      const user = getUser();
      expect(user).toBeNull();
      
      // Nota: No verificamos que se llamó a logger.error porque el logger
      // puede estar deshabilitado en ciertos entornos. Lo importante es
      // que la función maneje el error y retorne null.
    });

    it('debe eliminar un usuario de localStorage', () => {
      // Primero guardamos el usuario
      localStorage.setItem(USER, mockUserString);
      
      // Luego lo eliminamos
      removeUser();
      
      // Verificamos que ya no existe
      expect(localStorage.getItem(USER)).toBeNull();
    });
  });
});
