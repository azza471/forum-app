import { render, screen } from '@testing-library/react';
import Header from './Header';

describe('Header Component', () => {
  test('should render header title', () => {
    render(<Header />);

    expect(screen.getByText('DICODING FORUM APP')).toBeInTheDocument();
  });

  test('should render header element', () => {
    render(<Header />);

    const header = screen.getByRole('banner');

    expect(header).toBeInTheDocument();
  });
});
