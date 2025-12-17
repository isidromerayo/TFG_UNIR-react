import { render, screen } from '@testing-library/react';
import Custom404 from '../../pages/404';
import '@testing-library/jest-dom';

describe('404 Page', () => {
    it('renders the 404 page content', () => {
        const { container } = render(<Custom404 />);

        // Check for main heading
        expect(screen.getByText('Página no encontrada...')).toBeInTheDocument();

        // Check for error code
        expect(screen.getByText('error 404')).toBeInTheDocument();

        // Check for image
        // Since alt="" marks it as decorative, getByRole('img') excludes it
        const image = container.querySelector('img');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('alt', '');
    });
});
