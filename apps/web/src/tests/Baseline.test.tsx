import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

describe('Baseline Component Test', () => {
  it('renders a simple element correctly', () => {
    render(<div data-testid="test-div">Hello Vitest</div>);
    const element = screen.getByTestId('test-div');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello Vitest');
  });
});
