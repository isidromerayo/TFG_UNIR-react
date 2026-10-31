import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Acceso from '../../pages/acceso';

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock de la instancia de api y de SweetAlert2
jest.mock('../../utils/api', () => ({
  __esModule: true,
  default: { post: jest.fn() }
}));

jest.mock('sweetalert2', () => ({
  __esModule: true,
  default: { fire: jest.fn() }
}));

// Handles de los mocks (tipados para evitar accesos inseguros)
const mockPost = jest.requireMock<{ default: { post: jest.Mock } }>('../../utils/api').default.post;
const mockFire = jest.requireMock<{ default: { fire: jest.Mock } }>('sweetalert2').default.fire;
const mockPush = jest.fn();

describe('Acceso Page', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('renders acceso form correctly', () => {
    render(<Acceso />);

    expect(screen.getByRole('heading', { name: /acceso a tu cuenta/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /acceso/i })).toBeInTheDocument();
  });

  it('debería loguear correctamente al enviar el formulario', async () => {
    mockPost.mockResolvedValue({ data: { token: 'fake-token' } });
    render(<Acceso />);

    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /acceso/i }));

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(
        expect.stringContaining('/auth'),
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123'
        })
      );
      expect(mockFire).toHaveBeenCalledWith('Acceso', 'Logeado correctamente');
      expect(mockPush).toHaveBeenCalledWith('/mis-cursos');
    });
  });

  it('debería notificar el error de acceso', async () => {
    mockPost.mockRejectedValue(new Error('Acceso denegado'));
    render(<Acceso />);

    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /acceso/i }));

    await waitFor(() => {
      expect(mockFire).toHaveBeenCalledWith('Problemas acceso', 'No se ha podido logear, revise usuario/contraseña', 'error');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
}); 
