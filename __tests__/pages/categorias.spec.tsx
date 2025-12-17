import { render, screen, waitFor } from '@testing-library/react';
import Categorias from '../../pages/categorias';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios as a function for this test file
jest.mock('axios', () => {
    return {
        __esModule: true,
        default: jest.fn()
    };
});

const mockedAxios = axios as unknown as jest.Mock;

describe('Categorias Page', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders loading state initially', () => {
        mockedAxios.mockReturnValue(new Promise(() => { }));
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
        mockedAxios.mockResolvedValue(mockData);

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
