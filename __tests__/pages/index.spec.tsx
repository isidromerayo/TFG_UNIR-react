import { render, screen, waitFor } from '@testing-library/react';
import Home from '../../pages/index';
import axios from 'axios';
import { logger } from '../../utils/logger';

// Mock child components
jest.mock('../../components/SliderComponent', () => {
    return function MockSlider() {
        return <div data-testid="slider">Slider</div>;
    };
});
jest.mock('../../components/HomeComponent', () => {
    return function MockHome({ data }: any) {
        return (
            <div data-testid="home-component">
                <p>Items: {data?.cursos_mas_valorados?.length || 0}</p>
                <p>Reviews: {data?.valoraciones_cursos?.length || 0}</p>
                <p>Updates: {data?.cursos_actualizados?.length || 0}</p>
            </div>
        );
    };
});

// Mock logger
jest.mock('../../utils/logger', () => ({
    logger: {
        error: jest.fn()
    }
}));

// Mock axios explicitly
jest.mock('axios', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Home Page', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('renders loading state initially', () => {
        (mockedAxios.get as jest.Mock).mockReturnValue(new Promise(() => { }));

        render(<Home />);
        expect(screen.getByText('...Data Loading.....')).toBeInTheDocument();
    });

    it('renders data after fetch', async () => {
        const mockCursos = { data: { _embedded: { cursos: [{ id: 1 }] } } };
        const mockVal = { data: { _embedded: { valoraciones: [{ id: 1 }] } } };

        (mockedAxios.get as jest.Mock)
            .mockResolvedValueOnce(mockCursos)
            .mockResolvedValueOnce(mockVal)
            .mockResolvedValueOnce(mockCursos);

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByTestId('home-component')).toBeInTheDocument();
        });

        expect(screen.getByTestId('slider')).toBeInTheDocument();

        // Use loose matching or strict if in <p> tag
        expect(screen.getByText(/Items: 1/)).toBeInTheDocument();
        expect(screen.getByText(/Reviews: 1/)).toBeInTheDocument();
        expect(screen.getByText(/Updates: 1/)).toBeInTheDocument();
    });

    it('handles fetch error and logs it', async () => {
        (mockedAxios.get as jest.Mock).mockRejectedValue(new Error('Network Error'));

        render(<Home />);

        await waitFor(() => {
            expect(screen.getByTestId('home-component')).toBeInTheDocument();
        });

        expect(logger.error).toHaveBeenCalled();
        expect(screen.getByText(/Items: 0/)).toBeInTheDocument();
    });
});
