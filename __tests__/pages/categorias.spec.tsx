import { render, screen, waitFor } from '@testing-library/react';
import Categorias from '../../pages/categorias';
import '@testing-library/jest-dom';

// Mock api instance for this test file
jest.mock('../../utils/api', () => ({
    __esModule: true,
    default: { get: jest.fn() }
}));

// Mock logger to assert the error path
jest.mock('../../utils/logger', () => ({
    __esModule: true,
    logger: {
        error: jest.fn(),
        warn: jest.fn()
    }
}));

// Typed handles of the mocks: reading the methods off the real Logger instance
// would trip Codacy's `unbound-method`
const mockedApiGet = jest.requireMock<{ default: { get: jest.Mock } }>('../../utils/api').default.get;
const mockedLoggerError = jest.requireMock<{ logger: { error: jest.Mock } }>('../../utils/logger').logger.error;

describe('Categorias Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockedApiGet.mockReturnValue(new Promise<never>(() => undefined));
        render(<Categorias />);
        expect(screen.getByText('...Data Loading.....')).toBeInTheDocument();
    });

    it('renders categories after fetch', async () => {
        const mockData = {
            data: {
                _embedded: {
                    categorias: [
                        { id: 1, nombre: 'Frontend', descripcion: 'Web dev' },
                        { id: 2, nombre: 'Backend', descripcion: 'Server dev' }
                    ]
                }
            }
        };
        mockedApiGet.mockResolvedValue(mockData);

        render(<Categorias />);

        await waitFor(() => {
            expect(screen.getByText('Frontend')).toBeInTheDocument();
        });

        expect(screen.getByText('Web dev')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
        // Check link existence (partial check)
        expect(screen.getAllByText('ver cursos').length).toBeGreaterThan(0);
        expect(mockedLoggerError).not.toHaveBeenCalled();
    });

    it('renders an empty list when the response has no _embedded', async () => {
        mockedApiGet.mockResolvedValue({ data: {} });

        render(<Categorias />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Categorias de nuestros cursos/i })).toBeInTheDocument();
        });
        expect(screen.queryByText('Frontend')).not.toBeInTheDocument();
        expect(mockedLoggerError).not.toHaveBeenCalled();
    });

    it('logs the error and stops loading when the fetch rejects', async () => {
        mockedApiGet.mockRejectedValue({ message: 'boom', response: { status: 500 } });

        render(<Categorias />);

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /Categorias de nuestros cursos/i })).toBeInTheDocument();
        });
        expect(screen.queryByText('...Data Loading.....')).not.toBeInTheDocument();
        expect(mockedLoggerError).toHaveBeenCalledWith(
            'Error al cargar las categorías:',
            expect.objectContaining({ message: 'boom', status: 500 })
        );
    });
});
