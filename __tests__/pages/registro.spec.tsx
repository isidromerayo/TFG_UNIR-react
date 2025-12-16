
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import axios from 'axios';
import Registro from '../../pages/registro';

// Mock de useRouter
jest.mock('next/router', () => ({
    useRouter: jest.fn()
}));

// Mock de Swal.fire
jest.mock('sweetalert2', () => ({
    fire: jest.fn()
}));

// Mock de axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Registro Page', () => {
    const mockPush = jest.fn();

    beforeEach(() => {
        (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
        jest.clearAllMocks();
    });

    it('renders registro form correctly', () => {
        render(<Registro />);

        expect(screen.getByRole('heading', { name: /registro de usuario/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/nombre \(\*\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellidos \(\*\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electrónico \(\*\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contraseña \(\*\)/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /registrarse en el portal/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /limpiar formulario de registro/i })).toBeInTheDocument();
    });

    it('shows validation errors when submitting empty form', async () => {
        render(<Registro />);
        const submitButton = screen.getByRole('button', { name: /registrarse en el portal/i });

        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText('nombre is a required field')).toBeInTheDocument();
            expect(screen.getByText('apellidos is a required field')).toBeInTheDocument();
            expect(screen.getByText('email is a required field')).toBeInTheDocument();
            expect(screen.getByText('password is a required field')).toBeInTheDocument();
        });
    });



    it('successfully registers a user', async () => {
        mockedAxios.post.mockResolvedValue({ data: {} });
        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(mockedAxios.post).toHaveBeenCalledWith(
                expect.stringContaining('/usuarios'),
                expect.objectContaining({
                    nombre: 'Juan',
                    apellidos: 'Perez',
                    email: 'juan@example.com',
                    password: 'password123',
                    estado: 'P'
                }),
                expect.any(Object)
            );
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Alta',
                icon: 'success'
            }));
            expect(mockPush).toHaveBeenCalledWith('/acceso');
        });
    });

    it('handles registration error with message', async () => {
        const errorMessage = 'User already exists';
        mockedAxios.post.mockRejectedValue({
            response: {
                data: { message: errorMessage }
            }
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Alta de usuario',
                text: expect.stringContaining(errorMessage),
                icon: 'error'
            }));
        });
    });

    it('handles registration error with errors array', async () => {
        const errorMessage = 'Invalid data';
        mockedAxios.post.mockRejectedValue({
            response: {
                data: { errors: [{ message: errorMessage }] }
            }
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining(errorMessage),
            }));
        });
    });

    it('handles 400 error', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { status: 400 }
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Los datos proporcionados no son válidos'),
            }));
        });
    });

    it('handles 409 error', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { status: 409 }
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('El usuario ya existe'),
            }));
        });
    });

    it('handles timeout error', async () => {
        mockedAxios.post.mockRejectedValue({
            code: 'ECONNABORTED'
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Tiempo de espera agotado'),
            }));
        });
    });

    it('handles generic connection error', async () => {
        mockedAxios.post.mockRejectedValue({
            // No response structure
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                text: expect.stringContaining('Error de conexión con el servidor'),
            }));
        });
    });

    it('handles 500 error', async () => {
        mockedAxios.post.mockRejectedValue({
            response: { status: 500 }
        });

        render(<Registro />);

        fireEvent.change(screen.getByLabelText(/nombre \(\*\)/i), { target: { value: 'Juan' } });
        fireEvent.change(screen.getByLabelText(/apellidos \(\*\)/i), { target: { value: 'Perez' } });
        fireEvent.change(screen.getByLabelText(/correo electrónico \(\*\)/i), { target: { value: 'juan@example.com' } });
        fireEvent.change(screen.getByLabelText(/contraseña \(\*\)/i), { target: { value: 'password123' } });

        fireEvent.click(screen.getByRole('button', { name: /registrarse en el portal/i }));

        await waitFor(() => {
            expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
                title: 'Alta de usuario',
                text: 'Ha habido problemas con su registro',
                icon: 'error'
            }));
        });
    });

    it('resets form when clicking borrar', async () => {
        render(<Registro />);
        const emailInput = screen.getByLabelText(/correo electrónico \(\*\)/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'something' } });

        const resetButton = screen.getByRole('button', { name: /limpiar formulario de registro/i });
        fireEvent.click(resetButton);

        await waitFor(() => {
            expect(emailInput.value).toBe('');
        });
    });

});
