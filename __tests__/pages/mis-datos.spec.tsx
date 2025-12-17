
import { render, screen } from '@testing-library/react';
import MisDatos, { getServerSideProps } from '../../pages/mis-datos';
import { getUser, getToken } from '../../services';
import { NextRequestResponse } from '../../types';

// Mock services
jest.mock('../../services', () => ({
    getUser: jest.fn(),
    getToken: jest.fn()
}));

const mockUser = {
    id: 1,
    username: 'testuser',
    fullname: 'Test User',
    email: 'test@example.com',
    rol: 'user'
};

describe('MisDatos Page', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders user data when user is logged in', () => {
        (getUser as jest.Mock).mockReturnValue(mockUser);
        render(<MisDatos />);

        expect(screen.getByText('Mis datos')).toBeInTheDocument();
        expect(screen.getByText('Nombre y apellidos')).toBeInTheDocument();
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('Correo electrónico')).toBeInTheDocument();
        expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    it('renders nothing when user is not logged in', () => {
        (getUser as jest.Mock).mockReturnValue(null);
        render(<MisDatos />);

        expect(screen.queryByText('Mis datos')).not.toBeInTheDocument();
    });

    describe('getServerSideProps', () => {
        const mockReq = {} as any;
        const mockRes = {
            writeHead: jest.fn(),
            end: jest.fn()
        } as any;

        const context: NextRequestResponse = {
            req: mockReq,
            res: mockRes,
            query: {},
            resolvedUrl: ''
        };

        it('redirects to /acceso if no token provided', async () => {
            (getToken as jest.Mock).mockReturnValue('');

            const response = await getServerSideProps(context);

            expect(mockRes.writeHead).toHaveBeenCalledWith(307, { Location: "/acceso" });
            expect(mockRes.end).toHaveBeenCalled();
            expect(response).toEqual({ props: {} });
        });

        it('does not redirect if token is provided', async () => {
            (getToken as jest.Mock).mockReturnValue('valid-token');

            const response = await getServerSideProps(context);

            expect(mockRes.writeHead).not.toHaveBeenCalled();
            expect(mockRes.end).not.toHaveBeenCalled();
            expect(response).toEqual({ props: {} });
        });
    });
});
