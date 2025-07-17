import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import SliderComponent from "../../components/SliderComponent";
import { useRouter } from 'next/router';

// Mock de useRouter
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

const mockPush = jest.fn();

beforeEach(() => {
  // Configura el mock de useRouter antes de cada prueba
  (useRouter as jest.Mock).mockImplementation(() => ({
    route: '/',
    push: mockPush,
    query: {},
    pathname: '/',
    asPath: '/',
  }));
  
  // Limpia los mocks antes de cada prueba
  mockPush.mockClear();
});

describe('SliderComponent', () => {  
  it("debe renderizar el componente correctamente", () => {
    render(<SliderComponent />);
    
    // Verifica que el título esté presente
    expect(screen.getByText(/Encuentra tu curso/i)).toBeInTheDocument();
    
    // Verifica que el campo de búsqueda esté presente
    const input = screen.getByPlaceholderText('nombre del curso');
    expect(input).toBeInTheDocument();
    
    // Verifica que el botón de búsqueda esté presente
    const button = screen.getByRole('button', { name: /search/i });
    expect(button).toBeInTheDocument();
  });
  
  it("debe redirigir a la página de búsqueda al enviar el formulario", async () => {
    render(<SliderComponent />);
    
    // Simula la entrada de texto en el campo de búsqueda
    const input = screen.getByPlaceholderText('nombre del curso');
    fireEvent.change(input, { target: { value: 'react' } });
    
    // Encuentra el formulario por su rol 'search'
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    
    // Verifica que se llamó a router.push con los argumentos correctos
    expect(mockPush).toHaveBeenCalledTimes(1);
    expect(mockPush).toHaveBeenCalledWith('/busqueda/react');
  });
  
  it("debe manejar correctamente los espacios en blanco en la búsqueda", () => {
    render(<SliderComponent />);
    
    // Simula la entrada de texto con espacios en blanco
    const input = screen.getByPlaceholderText('nombre del curso');
    fireEvent.change(input, { target: { value: '  react  ' } });
    
    // Encuentra el formulario por su rol 'search'
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    
    // Verifica que se llamó a router.push con el término de búsqueda (incluyendo espacios)
    expect(mockPush).toHaveBeenCalledWith('/busqueda/  react  ');
  });
  
  it("debe manejar correctamente una búsqueda vacía", () => {
    render(<SliderComponent />);
    
    // Encuentra el formulario por su rol 'search'
    const form = screen.getByRole('search');
    fireEvent.submit(form);
    
    // Verifica que se llamó a router.push con una cadena vacía
    expect(mockPush).toHaveBeenCalledWith('/busqueda/');
  });
});