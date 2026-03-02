import { render, screen } from '@testing-library/react';
import ForecastCard from '../ForecastCard';
import type { DailyForecast } from '@/lib/types';

// Mock WeatherIcon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ weatherCode, size, className }: any) {
    return (
      <div 
        data-testid="weather-icon" 
        data-weather-code={weatherCode}
        data-size={size}
        className={className}
      >
        Mock Icon {weatherCode}
      </div>
    );
  };
});

describe('ForecastCard', () => {
  const mockForecast: DailyForecast = {
    date: '2024-01-15',
    tempMax: 22.5,
    tempMin: 15.2,
    weatherCode: 1
  };

  it('should render forecast card with celsius temperatures', () => {
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    expect(screen.getByText('23°C')).toBeInTheDocument(); // Rounded max temp
    expect(screen.getByText('15°C')).toBeInTheDocument(); // Rounded min temp
  });

  it('should render forecast card with fahrenheit temperatures', () => {
    render(<ForecastCard forecast={mockForecast} unit="fahrenheit" />);
    
    expect(screen.getByText('73°F')).toBeInTheDocument(); // Converted and rounded max temp
    expect(screen.getByText('59°F')).toBeInTheDocument(); // Converted and rounded min temp
  });

  it('should display "Today" for current date', () => {
    const today = new Date().toISOString().split('T')[0];
    const todayForecast: DailyForecast = {
      ...mockForecast,
      date: today
    };
    
    render(<ForecastCard forecast={todayForecast} unit="celsius" />);
    expect(screen.getByText('Today')).toBeInTheDocument();
  });

  it('should display "Tomorrow" for next day', () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split('T')[0];
    
    const tomorrowForecast: DailyForecast = {
      ...mockForecast,
      date: tomorrowDate
    };
    
    render(<ForecastCard forecast={tomorrowForecast} unit="celsius" />);
    expect(screen.getByText('Tomorrow')).toBeInTheDocument();
  });

  it('should display formatted date for other days', () => {
    const futureDate = '2024-12-25';
    const futureForecast: DailyForecast = {
      ...mockForecast,
      date: futureDate
    };
    
    render(<ForecastCard forecast={futureForecast} unit="celsius" />);
    
    // Should show formatted date like "Wed, Dec 25"
    const dateElement = screen.getByText(/Dec 25/);
    expect(dateElement).toBeInTheDocument();
  });

  it('should render weather icon with correct props', () => {
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    const weatherIcon = screen.getByTestId('weather-icon');
    expect(weatherIcon).toHaveAttribute('data-weather-code', '1');
    expect(weatherIcon).toHaveAttribute('data-size', 'md');
    expect(weatherIcon).toHaveClass('mb-3');
  });

  it('should handle extreme temperatures correctly', () => {
    const extremeForecast: DailyForecast = {
      date: '2024-01-15',
      tempMax: -10.7,
      tempMin: -25.3,
      weatherCode: 71
    };
    
    render(<ForecastCard forecast={extremeForecast} unit="celsius" />);
    
    expect(screen.getByText('-11°C')).toBeInTheDocument();
    expect(screen.getByText('-25°C')).toBeInTheDocument();
  });

  it('should handle extreme temperatures in fahrenheit', () => {
    const extremeForecast: DailyForecast = {
      date: '2024-01-15',
      tempMax: 40.5,
      tempMin: 35.2,
      weatherCode: 0
    };
    
    render(<ForecastCard forecast={extremeForecast} unit="fahrenheit" />);
    
    expect(screen.getByText('105°F')).toBeInTheDocument(); // 40.5°C = 104.9°F ≈ 105°F
    expect(screen.getByText('95°F')).toBeInTheDocument();  // 35.2°C = 95.36°F ≈ 95°F
  });

  it('should apply correct CSS classes', () => {
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    const card = screen.getByText('23°C').closest('div');
    expect(card?.parentElement).toHaveClass(
      'flex',
      'flex-col',
      'items-center',
      'p-4',
      'bg-foreground',
      'shadow-md',
      'rounded-lg',
      'min-w-[140px]'
    );
  });

  it('should handle zero temperatures', () => {
    const zeroTempForecast: DailyForecast = {
      date: '2024-01-15',
      tempMax: 0,
      tempMin: 0,
      weatherCode: 2
    };
    
    render(<ForecastCard forecast={zeroTempForecast} unit="celsius" />);
    
    expect(screen.getByText('0°C')).toBeInTheDocument();
  });

  it('should handle fractional temperatures correctly', () => {
    const fractionalForecast: DailyForecast = {
      date: '2024-01-15',
      tempMax: 22.4,  // Should round to 22
      tempMin: 15.6,  // Should round to 16
      weatherCode: 3
    };
    
    render(<ForecastCard forecast={fractionalForecast} unit="celsius" />);
    
    expect(screen.getByText('22°C')).toBeInTheDocument();
    expect(screen.getByText('16°C')).toBeInTheDocument();
  });

  it('should handle different weather codes', () => {
    const weatherCodes = [0, 61, 71, 95];
    
    weatherCodes.forEach(code => {
      const forecast: DailyForecast = {
        ...mockForecast,
        weatherCode: code
      };
      
      const { unmount } = render(<ForecastCard forecast={forecast} unit="celsius" />);
      
      const weatherIcon = screen.getByTestId('weather-icon');
      expect(weatherIcon).toHaveAttribute('data-weather-code', code.toString());
      
      unmount();
    });
  });

  it('should maintain consistent layout structure', () => {
    render(<ForecastCard forecast={mockForecast} unit="celsius" />);
    
    // Check that all main elements are present
    expect(screen.getByText(/Jan 15/)).toBeInTheDocument(); // Date
    expect(screen.getByTestId('weather-icon')).toBeInTheDocument(); // Icon
    expect(screen.getByText('23°C')).toBeInTheDocument(); // Max temp
    expect(screen.getByText('15°C')).toBeInTheDocument(); // Min temp
  });
});