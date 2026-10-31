import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import api from '../../utils/api';
import Acceso from '../../pages/acceso';

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock de Swal.fire
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

// Mock de la instancia de api
jest.mock('../../utils/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('Acceso Page', () => {
  const mockPush = jest.fn();

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
    mockedApi.post.mockResolvedValue({ data: { token: 'fake-token' } });
    render(<Acceso />);

    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /acceso/i }));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith(
        expect.stringContaining('/auth'),
        expect.objectContaining({
          email: 'test@example.com',
          password: 'password123'
        })
      );
      expect(Swal.fire).toHaveBeenCalledWith('Acceso', 'Logeado correctamente');
      expect(mockPush).toHaveBeenCalledWith('/mis-cursos');
    });
  });

  it('debería notificar el error de acceso', async () => {
    mockedApi.post.mockRejectedValue(new Error('Acceso denegado'));
    render(<Acceso />);

    fireEvent.change(screen.getByPlaceholderText(/email address/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /acceso/i }));

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Problemas acceso', 'No se ha podido logear, revise usuario/contraseña', 'error');
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
}); 
