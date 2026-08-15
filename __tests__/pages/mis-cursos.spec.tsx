import { render, screen, waitFor } from '@testing-library/react';
import MisCursos, { getServerSideProps } from '../../pages/mis-cursos';
import api from '../../utils/api';
import { getToken, getUser } from '../../services';
import '@testing-library/jest-dom';

// Mock services
jest.mock('../../services', () => ({
    getToken: jest.fn(),
    getUser: jest.fn()
}));

// Mock api
jest.mock('../../utils/api', () => ({
    __esModule: true,
    default: {
        get: jest.fn()
    }
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
    logger: {
        log: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
        debug: jest.fn()
    }
}));

const mockUser = {
    id: 1,
    username: 'testuser',
    fullname: 'Test User',
    email: 'test@example.com'
};

const mockApiGet = api.get as jest.Mock;

describe('MisCursos Page', () => {
    describe('Component', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('renders correctly', () => {
            (getUser as jest.Mock).mockReturnValue(mockUser);
            mockApiGet.mockResolvedValue({ data: { _embedded: { cursos: [] } } });

            render(<MisCursos />);

            expect(screen.getByText('Mis cursos')).toBeInTheDocument();
        });

        it('muestra el mensaje cuando no hay cursos matriculados', async () => {
            (getUser as jest.Mock).mockReturnValue(mockUser);
            mockApiGet.mockResolvedValue({ data: { _embedded: { cursos: [] } } });

            render(<MisCursos />);

            await waitFor(() => {
                expect(screen.getByText('No tienes cursos matriculados.')).toBeInTheDocument();
            });
            expect(screen.queryByText(/detalle-curso/i)).not.toBeInTheDocument();
        });

        it('muestra los cursos cuando el usuario tiene cursos matriculados', async () => {
            (getUser as jest.Mock).mockReturnValue(mockUser);
            mockApiGet.mockResolvedValue({
                data: {
                    _embedded: {
                        cursos: [
                            { id: 1, titulo: 'Curso React', descripcion: 'Aprende React' },
                            { id: 2, titulo: 'Curso Angular', descripcion: 'Aprende Angular' }
                        ]
                    }
                }
            });

            render(<MisCursos />);

            await waitFor(() => {
                expect(screen.getByText('Curso React')).toBeInTheDocument();
                expect(screen.getByText('Aprende React')).toBeInTheDocument();
            });
            expect(screen.getByText('Curso Angular')).toBeInTheDocument();
            expect(screen.queryByText('No tienes cursos matriculados.')).not.toBeInTheDocument();
        });

        it('muestra el mensaje si la petición falla', async () => {
            (getUser as jest.Mock).mockReturnValue(mockUser);
            mockApiGet.mockRejectedValue({ message: 'error', response: { status: 404, data: {} } });

            render(<MisCursos />);

            await waitFor(() => {
                expect(screen.getByText('No tienes cursos matriculados.')).toBeInTheDocument();
            });
        });

        it('no pide cursos si no hay usuario', () => {
            (getUser as jest.Mock).mockReturnValue(null);

            render(<MisCursos />);

            expect(mockApiGet).not.toHaveBeenCalled();
        });
    });

    describe('getServerSideProps', () => {
        it('redirects to /acceso if no token', async () => {
            (getToken as jest.Mock).mockReturnValue('');

            const req = {} as any;
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            } as any;

            await getServerSideProps({ req, res } as any);

            expect(res.writeHead).toHaveBeenCalledWith(307, { Location: "/acceso" });
            expect(res.end).toHaveBeenCalled();
        });

        it('returns empty props if token exists', async () => {
            (getToken as jest.Mock).mockReturnValue('valid-token');

            const req = {} as any;
            const res = {
                writeHead: jest.fn(),
                end: jest.fn()
            } as any;

            const result = await getServerSideProps({ req, res } as any);

            expect(res.writeHead).not.toHaveBeenCalled();
            expect(result).toEqual({ props: {} });
        });
    });
});
