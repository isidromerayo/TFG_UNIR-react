import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach } from '@jest/globals';
import type { Curso } from '../../types';

// Mock de la instancia de api (el componente la usa como funcion: api(url))
jest.mock('../../utils/api', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});

// Mock del logger para poder afirmar sobre el camino de error
jest.mock('../../utils/logger', () => ({
    __esModule: true,
    logger: {
        error: jest.fn(),
        warn: jest.fn()
    }
}));

import Busqueda, { getServerSideProps } from '../../pages/busqueda/[query]';
import api from '../../utils/api';
import { logger } from '../../utils/logger';

const mockedApi = api as unknown as jest.Mock;
const mockedLoggerError = logger.error as jest.Mock;

const curso = (id: number, titulo: string): Curso => ({
    id,
    titulo,
    descripcion: `Descripcion de ${titulo}`,
    precio: 99.9,
    valoracionMedia: 4.5,
    fechaCreacion: '2026-01-01',
    fechaActualizacion: '2026-01-02'
});

describe('Busqueda Page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe tener getServerSideProps definido', () => {
    expect(getServerSideProps).toBeDefined();
    expect(typeof getServerSideProps).toBe('function');
  });

  it('getServerSideProps debe retornar notFound para query inválido', async () => {
    const result1 = await getServerSideProps({ query: {} } as any);
    expect(result1).toEqual({ notFound: true });

    const result2 = await getServerSideProps({ query: { query: ['array'] } } as any);
    expect(result2).toEqual({ notFound: true });
  });

  it('getServerSideProps debe retornar props para query válido', async () => {
    const result = await getServerSideProps({ query: { query: 'react' } } as any);
    expect(result).toEqual({ props: { query_string: 'react' } });
  });
});

describe('Busqueda Page (componente)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('muestra el estado de carga mientras la petición pendiente', () => {
    mockedApi.mockReturnValue(new Promise(() => { }));

    render(<Busqueda query_string="react" />);

    expect(screen.getByText('...Data Loading.....')).toBeInTheDocument();
  });

  it('renderiza los cursos cuando la búsqueda tiene resultados', async () => {
    mockedApi.mockResolvedValue({
        data: { _embedded: { cursos: [curso(1, 'React moderno')] } }
    });

    render(<Busqueda query_string="react" />);

    await waitFor(() => {
        expect(screen.getByText('React moderno')).toBeInTheDocument();
    });
    expect(screen.getByText('detalle del curso')).toBeInTheDocument();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('muestra sin resultados cuando la respuesta no trae _embedded', async () => {
    mockedApi.mockResolvedValue({ data: {} });

    render(<Busqueda query_string="nada" />);

    await waitFor(() => {
        expect(screen.getByText(/No hay resultados para el texto indicado/)).toBeInTheDocument();
    });
  });

  it('muestra sin resultados y registra el error si la petición rechaza', async () => {
    mockedApi.mockRejectedValue({ message: 'boom', response: { status: 500 } });

    render(<Busqueda query_string="react" />);

    await waitFor(() => {
        expect(screen.getByText(/No hay resultados para el texto indicado/)).toBeInTheDocument();
    });
    expect(mockedLoggerError).toHaveBeenCalledWith(
        'Error al buscar cursos:',
        expect.objectContaining({ message: 'boom', status: 500 })
    );
  });
});
