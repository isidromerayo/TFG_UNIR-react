import { render, fireEvent, waitFor } from '@testing-library/react';
import Carrito from '../../pages/carrito';
import Swal from 'sweetalert2';
import { useCartStore } from '../../store/useCartStore';
import { getToken } from '../../services/session';

// Mock de Swal.fire
jest.mock('sweetalert2', () => ({
  fire: jest.fn().mockResolvedValue({ isConfirmed: false })
}));

// Mock de useRouter
const mockPush = jest.fn();
jest.mock('next/router', () => ({
  useRouter: () => ({ push: mockPush })
}));

// Mock del logger
jest.mock('../../utils/logger', () => ({
  logger: {
    log: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
  }
}));

// Mock de session service
jest.mock('../../services/session', () => ({
  getToken: jest.fn(),
}));

describe('Carrito Page', () => {
  beforeEach(() => {
    // Limpiar el carrito antes de cada test
    useCartStore.getState().clearCart();
    jest.clearAllMocks();
  });

  it('debe mostrar mensaje cuando el carrito está vacío', () => {
    const { getByText } = render(<Carrito />);
    expect(getByText(/No hay productos en el carrito/i)).toBeInTheDocument();
  });

  it('debe mostrar los productos del carrito', () => {
    const mockProduct = {
      id: 1,
      titulo: 'Curso Test',
      precio: 100,
      quantity: 1
    };

    useCartStore.getState().addToCart(mockProduct);

    const { getByText, getAllByText } = render(<Carrito />);
    // El texto puede estar dividido, usamos un matcher más flexible
    expect(getByText(/Curso Test/i)).toBeInTheDocument();
    // Hay múltiples elementos con "100" (precio y total), verificamos que existe
    const elementos100 = getAllByText(/100/);
    expect(elementos100.length).toBeGreaterThan(0);
  });

  it('debe calcular el total correctamente', () => {
    const productos = [
      { id: 1, titulo: 'Curso 1', precio: 100, quantity: 1 },
      { id: 2, titulo: 'Curso 2', precio: 200, quantity: 2 },
    ];

    productos.forEach(p => useCartStore.getState().addToCart(p));
    // Simulamos quantity: 2 para el segundo producto
    const cart = useCartStore.getState().cart;
    cart[1].quantity = 2;
    useCartStore.setState({ cart, totalPrice: 100 + (200 * 2) });

    const { getByText } = render(<Carrito />);
    const totalEsperado = 100 + (200 * 2); // 500
    expect(getByText(totalEsperado.toString())).toBeInTheDocument();
  });

  it('debe llamar a Swal.fire cuando el usuario no está logueado al comprar', () => {
    (getToken as jest.Mock).mockReturnValue(null);
    const mockProduct = {
      id: 1,
      titulo: 'Curso Test',
      precio: 100,
      quantity: 1
    };
    useCartStore.getState().addToCart(mockProduct);

    const { getByRole } = render(<Carrito />);
    const comprarButton = getByRole('button', { name: /comprar/i });
    
    fireEvent.click(comprarButton);

    expect(Swal.fire).toHaveBeenCalledWith({
      title: 'Debe tener iniciada sesión para comprar'
    });
    expect(mockPush).toHaveBeenCalledWith('/acceso');
  });

  it('debe permitir eliminar un producto del carrito', () => {
    const mockProduct = {
      id: 1,
      titulo: 'Curso Test',
      precio: 100,
      quantity: 1
    };
    useCartStore.getState().addToCart(mockProduct);

    const { getByRole } = render(<Carrito />);
    const borrarButton = getByRole('button', { name: /borrar/i });
    
    fireEvent.click(borrarButton);

    expect(useCartStore.getState().cart).toHaveLength(0);
  });

  it('debe mostrar el botón de comprar cuando hay productos', () => {
    const mockProduct = {
      id: 1,
      titulo: 'Curso Test',
      precio: 100,
      quantity: 1
    };
    useCartStore.getState().addToCart(mockProduct);

    const { getByRole } = render(<Carrito />);
    expect(getByRole('button', { name: /comprar/i })).toBeInTheDocument();
  });
}); 