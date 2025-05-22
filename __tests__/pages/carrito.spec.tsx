import { render, fireEvent } from '@testing-library/react';
import Carrito from '../../pages/carrito';
import Swal from 'sweetalert2';

// Mock de Swal.fire
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: () => ({ push: jest.fn() })
}));

// Importar el store real de Zustand
import * as store from '../../store/useCartStore';

describe('Carrito Page', () => {
  beforeEach(() => {
    // Sobrescribir el estado del store antes de cada test
    store.useCartStore.setState({
      cart: [{
        id: 1,
        titulo: 'Curso Test',
        precio: 100,
        quantity: 1
      }],
      removeFromCart: jest.fn(),
      clearCart: jest.fn()
    });
    jest.clearAllMocks();
  });

  it('debería llamar a Swal.fire cuando el usuario no está logueado al comprar', () => {
    const { getByRole } = render(<Carrito />);
    const comprarButton = getByRole('button', { name: /comprar/i });
    expect(comprarButton).toBeInTheDocument();

    fireEvent.click(comprarButton);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Debe tener iniciada sesión para comprar'
    });
  });
}); 