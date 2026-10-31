import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import type { Categoria, Curso } from '../../types';

// Mock global fetch (la usa getServerSideProps)
global.fetch = jest.fn();

// Mock de useRouter: el componente lo usa solo para router.isReady
jest.mock('next/router', () => ({
  useRouter: jest.fn()
}));

// Mock de la instancia de api (el componente la usa como funcion: api(url))
jest.mock('../../utils/api', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock del logger para afirmar sobre el camino de error
jest.mock('../../utils/logger', () => ({
  __esModule: true,
  logger: {
    error: jest.fn(),
    warn: jest.fn()
  }
}));

import CategoriaPage from '../../pages/categoria/[id]';
import { getServerSideProps } from '../../pages/categoria/[id]';
import api from '../../utils/api';
import { logger } from '../../utils/logger';

const mockedApi = api as unknown as jest.Mock;
const mockedLoggerError = logger.error as jest.Mock;

const categoria: Categoria = { id: 7, nombre: 'Backend', descripcion: 'APIs' };

const curso = (id: number, titulo: string): Curso => ({
  id,
  titulo,
  descripcion: `Descripcion de ${titulo}`,
  precio: 49.9,
  valoracionMedia: 4,
  fechaCreacion: '2026-01-01',
  fechaActualizacion: '2026-01-02'
});

describe('Categoria Page', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  it('debe tener getServerSideProps definido', () => {
    expect(getServerSideProps).toBeDefined();
    expect(typeof getServerSideProps).toBe('function');
  });

  it('getServerSideProps debe retornar notFound para id inválido', async () => {
    const result1 = await getServerSideProps({ query: {} } as any);
    expect(result1).toEqual({ notFound: true });

    const result2 = await getServerSideProps({ query: { id: 'abc' } } as any);
    expect(result2).toEqual({ notFound: true });
  });

  it('getServerSideProps debe retornar props para id válido', async () => {
    const mockData = { id: 1, nombre: 'Test Category' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: () => Promise.resolve(mockData)
    });

    const result = await getServerSideProps({ query: { id: '1' } } as any);
    expect(result).toEqual({ props: { data: mockData } });
  });
});

describe('Categoria Page (componente)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ isReady: true });
  });

  it('muestra el estado de carga mientras la petición está pendiente', () => {
    mockedApi.mockReturnValue(new Promise(() => { }));

    render(<CategoriaPage data={categoria} />);

    expect(screen.getByText('...Data Loading.....')).toBeInTheDocument();
  });

  it('renderiza los cursos de la categoría', async () => {
    mockedApi.mockResolvedValue({
      data: { _embedded: { cursos: [curso(1, 'Spring Boot'), curso(2, 'Quarkus')] } }
    });

    render(<CategoriaPage data={categoria} />);

    await waitFor(() => {
      expect(screen.getByText('Spring Boot')).toBeInTheDocument();
    });
    expect(screen.getByText('Quarkus')).toBeInTheDocument();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('muestra el aviso vacío cuando la respuesta no trae _embedded', async () => {
    mockedApi.mockResolvedValue({ data: {} });

    render(<CategoriaPage data={categoria} />);

    await waitFor(() => {
      expect(screen.getByText('Sin cursos en esta categoría')).toBeInTheDocument();
    });
  });

  it('muestra el aviso vacío y registra el error si la petición rechaza', async () => {
    mockedApi.mockRejectedValue({ message: 'boom', response: { status: 503 } });

    render(<CategoriaPage data={categoria} />);

    await waitFor(() => {
      expect(screen.getByText('Sin cursos en esta categoría')).toBeInTheDocument();
    });
    expect(mockedLoggerError).toHaveBeenCalledWith(
      'Error al cargar los cursos de la categoría:',
      expect.objectContaining({ message: 'boom', status: 503 })
    );
  });
});
