import { describe, it, expect, beforeEach } from '@jest/globals';
import { act } from '@testing-library/react';
import { useCartStore } from '../../store/useCartStore';

// Mock de un producto para usar en las pruebas
const mockProduct = {
  id: 1,
  titulo: 'Curso de Prueba',
  precio: 100,
  descripcion: 'Descripción de prueba',
};

describe('useCartStore', () => {
  // Limpiar el store antes de cada prueba
  beforeEach(() => {
    act(() => {
      useCartStore.getState().clearCart();
    });
  });

  it('debe inicializar con un carrito vacío', () => {
    const { cart, totalPrice } = useCartStore.getState();
    expect(cart).toEqual([]);
    expect(totalPrice).toBe(0);
  });

  describe('addToCart', () => {
    it('debe añadir un producto al carrito', () => {
      act(() => {
        useCartStore.getState().addToCart(mockProduct);
      });

      const { cart, totalPrice } = useCartStore.getState();
      expect(cart).toHaveLength(1);
      expect(cart[0]).toEqual({ ...mockProduct, quantity: 1 });
      expect(totalPrice).toBe(mockProduct.precio);
    });

    it('no debe añadir el mismo producto dos veces', () => {
      act(() => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().addToCart(mockProduct);
      });

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(1);
    });
  });

  describe('removeFromCart', () => {
    it('debe eliminar un producto del carrito', () => {
      // Primero añadimos un producto
      act(() => {
        useCartStore.getState().addToCart(mockProduct);
      });

      // Luego lo eliminamos
      act(() => {
        useCartStore.getState().removeFromCart(mockProduct);
      });

      const { cart, totalPrice } = useCartStore.getState();
      expect(cart).toHaveLength(0);
      expect(totalPrice).toBe(0);
    });

    it('no debe hacer nada si el producto no está en el carrito', () => {
      const otroProducto = { ...mockProduct, id: 2 };
      
      act(() => {
        useCartStore.getState().addToCart(mockProduct);
        useCartStore.getState().removeFromCart(otroProducto);
      });

      const { cart } = useCartStore.getState();
      expect(cart).toHaveLength(1);
    });
  });

  describe('clearCart', () => {
    it('debe vaciar el carrito completamente', () => {
      // Añadimos varios productos
      const productos = [
        mockProduct,
        { ...mockProduct, id: 2, precio: 200 },
        { ...mockProduct, id: 3, precio: 300 },
      ];

      act(() => {
        productos.forEach(producto => {
          useCartStore.getState().addToCart(producto);
        });
      });

      // Verificamos que se hayan añadido
      expect(useCartStore.getState().cart).toHaveLength(3);
      
      // Vaciamos el carrito
      act(() => {
        useCartStore.getState().clearCart();
      });

      const { cart, totalPrice } = useCartStore.getState();
      expect(cart).toHaveLength(0);
      expect(totalPrice).toBe(0);
    });
  });

  it('debe calcular correctamente el precio total', () => {
    const productos = [
      { ...mockProduct, id: 1, precio: 100 },
      { ...mockProduct, id: 2, precio: 200 },
      { ...mockProduct, id: 3, precio: 300 },
    ];

    act(() => {
      productos.forEach(producto => {
        useCartStore.getState().addToCart(producto);
      });
    });

    const precioTotalEsperado = productos.reduce((sum, producto) => sum + producto.precio, 0);
    expect(useCartStore.getState().totalPrice).toBe(precioTotalEsperado);
  });
});
