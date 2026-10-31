import { render, screen, waitFor } from '@testing-library/react';
import Categorias from '../../pages/categorias';
import api from '../../utils/api';
import '@testing-library/jest-dom';

// Mock api instance for this test file
jest.mock('../../utils/api', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});

const mockedApi = api as unknown as jest.Mock;

describe('Categorias Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockedApi.mockReturnValue(new Promise(() => { }));
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
        mockedApi.mockResolvedValue(mockData);

        render(<Categorias />);

        await waitFor(() => {
            expect(screen.getByText('Frontend')).toBeInTheDocument();
        });

        expect(screen.getByText('Web dev')).toBeInTheDocument();
        expect(screen.getByText('Backend')).toBeInTheDocument();
        // Check link existence (partial check)
        expect(screen.getAllByText('ver cursos').length).toBeGreaterThan(0);
    });
});
