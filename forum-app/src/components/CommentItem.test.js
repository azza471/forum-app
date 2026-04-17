import { render, screen } from '@testing-library/react';
import CommentItem from './CommentItem';

describe('CommentItem Component', () => {
  const mockComment = {
    content: 'Ini komentar test',
    owner: {
      name: 'Leon',
    },
  };

  test('should render comment content correctly', () => {
    render(<CommentItem comment={mockComment} />);

    expect(screen.getByText('Ini komentar test')).toBeInTheDocument();
  });

  test('should render comment owner name correctly', () => {
    render(<CommentItem comment={mockComment} />);

    expect(screen.getByText(/Leon/)).toBeInTheDocument();
  });

  test('should render full comment structure', () => {
    render(<CommentItem comment={mockComment} />);

    expect(screen.getByText('Ini komentar test')).toBeInTheDocument();
    expect(screen.getByText(/by/)).toBeInTheDocument();
    expect(screen.getByText(/Leon/)).toBeInTheDocument();
  });
});
