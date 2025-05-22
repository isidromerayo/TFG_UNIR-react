import { render, fireEvent, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';
import Acceso from '../../pages/acceso';

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock de Swal.fire
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

// Mock de XMLHttpRequest
const mockXHR = {
  open: jest.fn(),
  send: jest.fn(),
  setRequestHeader: jest.fn(),
  readyState: 4,
  status: 200,
  responseText: JSON.stringify({ token: 'fake-token' })
};
global.XMLHttpRequest = jest.fn(() => mockXHR) as any;

describe('Acceso Page', () => {
  const mockPush = jest.fn();
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    jest.clearAllMocks();
  });

  it('debería llamar a Swal.fire al loguear correctamente', async () => {
    const { getByPlaceholderText, getByRole } = render(<Acceso />);
    const emailInput = getByPlaceholderText(/email address/i);
    const passwordInput = getByPlaceholderText(/password/i);
    const submitButton = getByRole('button', { name: /acceso/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Simular respuesta exitosa
    mockXHR.onreadystatechange();

    await waitFor(() => {
      expect(Swal.fire).toHaveBeenCalledWith('Acceso', 'Logeado correctamente');
    });
  });
}); 