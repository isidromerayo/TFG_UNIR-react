import { render, screen } from '@testing-library/react';
import MisCursos, { getServerSideProps } from '../../pages/mis-cursos';
import { getToken } from '../../services';
import '@testing-library/jest-dom';

// Mock services
jest.mock('../../services', () => ({
    getToken: jest.fn()
}));

describe('MisCursos Page', () => {
    describe('Component', () => {
        it('renders correctly', () => {
            render(<MisCursos />);
            expect(screen.getByText('Mis cursos')).toBeInTheDocument();
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
