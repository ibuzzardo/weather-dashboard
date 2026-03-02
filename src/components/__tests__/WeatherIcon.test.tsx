import { render, screen } from '@testing-library/react';
import WeatherIcon from '../WeatherIcon';

describe('WeatherIcon', () => {
  it('should render weather icon with correct emoji and description', () => {
    render(<WeatherIcon weatherCode={0} />);
    
    const icon = screen.getByRole('img');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('aria-label', 'Clear sky');
    expect(icon).toHaveAttribute('title', 'Clear sky');
    expect(icon).toHaveTextContent('☀️');
  });

  it('should apply correct size classes', () => {
    const { rerender } = render(<WeatherIcon weatherCode={1} size="sm" />);
    expect(screen.getByRole('img')).toHaveClass('text-2xl');

    rerender(<WeatherIcon weatherCode={1} size="md" />);
    expect(screen.getByRole('img')).toHaveClass('text-4xl');

    rerender(<WeatherIcon weatherCode={1} size="lg" />);
    expect(screen.getByRole('img')).toHaveClass('text-6xl');
  });

  it('should use medium size as default', () => {
    render(<WeatherIcon weatherCode={2} />);
    expect(screen.getByRole('img')).toHaveClass('text-4xl');
  });

  it('should apply custom className', () => {
    render(<WeatherIcon weatherCode={3} className="custom-class" />);
    expect(screen.getByRole('img')).toHaveClass('custom-class');
  });

  it('should handle unknown weather codes', () => {
    render(<WeatherIcon weatherCode={999} />);
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('aria-label', 'Unknown');
    expect(icon).toHaveAttribute('title', 'Unknown');
    expect(icon).toHaveTextContent('❓');
  });

  it('should render different weather conditions correctly', () => {
    const testCases = [
      { code: 61, expectedEmoji: '🌧️', expectedDescription: 'Slight rain' },
      { code: 71, expectedEmoji: '🌨️', expectedDescription: 'Slight snow fall' },
      { code: 95, expectedEmoji: '⛈️', expectedDescription: 'Thunderstorm' },
      { code: 45, expectedEmoji: '🌫️', expectedDescription: 'Fog' }
    ];

    testCases.forEach(({ code, expectedEmoji, expectedDescription }) => {
      const { unmount } = render(<WeatherIcon weatherCode={code} />);
      
      const icon = screen.getByRole('img');
      expect(icon).toHaveTextContent(expectedEmoji);
      expect(icon).toHaveAttribute('aria-label', expectedDescription);
      expect(icon).toHaveAttribute('title', expectedDescription);
      
      unmount();
    });
  });

  it('should combine size and custom classes correctly', () => {
    render(<WeatherIcon weatherCode={0} size="lg" className="text-blue-500 hover:text-blue-600" />);
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveClass('text-6xl');
    expect(icon).toHaveClass('text-blue-500');
    expect(icon).toHaveClass('hover:text-blue-600');
  });

  it('should be accessible', () => {
    render(<WeatherIcon weatherCode={2} />);
    
    const icon = screen.getByRole('img');
    expect(icon).toHaveAttribute('role', 'img');
    expect(icon).toHaveAttribute('aria-label');
    expect(icon).toHaveAttribute('title');
  });
});