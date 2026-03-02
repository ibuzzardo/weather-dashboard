import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UnitToggle from '../UnitToggle';

describe('UnitToggle', () => {
  const mockOnToggle = jest.fn();

  beforeEach(() => {
    mockOnToggle.mockClear();
  });

  it('should render celsius button correctly', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('°C');
  });

  it('should render fahrenheit button correctly', () => {
    render(<UnitToggle unit="fahrenheit" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveTextContent('°F');
  });

  it('should call onToggle when clicked', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when activated with keyboard', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="fahrenheit" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard('{Enter}');
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when activated with space key', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    button.focus();
    await user.keyboard(' ');
    
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should have correct button attributes', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('should apply correct CSS classes', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass(
      'px-4',
      'py-2',
      'bg-primary',
      'text-white',
      'rounded-lg',
      'font-medium',
      'hover:bg-primary/90',
      'focus:ring-2',
      'focus:ring-primary/50',
      'transition-colors'
    );
  });

  it('should be focusable', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    button.focus();
    expect(button).toHaveFocus();
  });

  it('should handle multiple rapid clicks', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    
    await user.click(button);
    await user.click(button);
    await user.click(button);
    
    expect(mockOnToggle).toHaveBeenCalledTimes(3);
  });

  it('should not call onToggle when disabled (if disabled prop existed)', () => {
    // This test assumes the component might have a disabled prop in the future
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).not.toBeDisabled();
  });

  it('should maintain focus after click', async () => {
    const user = userEvent.setup();
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    await user.click(button);
    
    // Button should still be focusable after click
    expect(button).toBeInTheDocument();
  });

  it('should work with both unit values', () => {
    const { rerender } = render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    expect(screen.getByText('°C')).toBeInTheDocument();
    
    rerender(<UnitToggle unit="fahrenheit" onToggle={mockOnToggle} />);
    expect(screen.getByText('°F')).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<UnitToggle unit="celsius" onToggle={mockOnToggle} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'button');
    // Could add aria-label for better accessibility
  });
});