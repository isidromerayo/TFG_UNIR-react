import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { render, screen } from '@testing-library/react';

// Mock del logger
jest.mock('../../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
    }
}));

const addToCartMock = jest.fn();

jest.mock('../../store/useCartStore', () => ({
    useCartStore: (selector: any) => selector({ addToCart: addToCartMock }),
}));

jest.mock('sweetalert2', () => ({
    fire: jest.fn(),
}));

// Mock de fetch global
global.fetch = jest.fn();

// Mock de useRouter para evitar el error
jest.mock('next/router', () => ({
    useRouter: () => ({
        query: { id: '123' },
        push: jest.fn(),
        pathname: '/curso/123',
        asPath: '/curso/123',
    })
}));

describe('Curso Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        addToCartMock.mockClear();
    });

    describe('Basic Rendering', () => {
        const mockCursoData = {
            id: 123,
            titulo: 'Curso Test',
            descripcion: 'Descripción Test',
            precio: 10,
            valoracionMedia: 4,
            fechaCreacion: '2024-01-01',
            fechaActualizacion: '2024-01-02',
            instructor: { nombre: 'Ada', apellidos: 'Lovelace' },
        };
        it('debe renderizar el estado de loading inicial', async () => {
            const CursoPage = (await import('../../pages/curso/[id]')).default;

            (global.fetch as jest.Mock).mockReturnValueOnce(new Promise(() => undefined));

            render(<CursoPage />);
            expect(screen.getByText('...Data Loading.....')).toBeInTheDocument();
        });

        it('debe mostrar "Curso no encontrado" cuando la API no devuelve datos', async () => {
            const CursoPage = (await import('../../pages/curso/[id]')).default;

            (global.fetch as jest.Mock).mockResolvedValueOnce({ ok: false });

            render(<CursoPage />);
            expect(await screen.findByText('Curso no encontrado')).toBeInTheDocument();
        });

        it('debe renderizar el curso cuando la API devuelve datos', async () => {
            const CursoPage = (await import('../../pages/curso/[id]')).default;
            const fetchMock = (global.fetch as jest.MockedFunction<typeof fetch>);

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockCursoData,
            } as any);

            render(<CursoPage />);
            expect(await screen.findByText('Curso Test')).toBeInTheDocument();
        });

        it('debe añadir el curso al carrito al pulsar "Comprar curso"', async () => {
            const Swal = (await import('sweetalert2')).default as any;
            const CursoPage = (await import('../../pages/curso/[id]')).default;
            const fetchMock = (global.fetch as jest.MockedFunction<typeof fetch>);

            fetchMock.mockResolvedValueOnce({
                ok: true,
                json: async () => mockCursoData,
            } as any);

            render(<CursoPage />);
            await screen.findByText('Curso Test');

            const button = await screen.findByRole('button', { name: 'Comprar curso' });
            button.click();

            expect(addToCartMock).toHaveBeenCalledTimes(1);
            expect(Swal.fire).toHaveBeenCalledTimes(1);
        });
    });
});
