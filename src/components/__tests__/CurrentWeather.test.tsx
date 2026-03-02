import { render, screen } from '@testing-library/react';
import CurrentWeather from '../CurrentWeather';
import type { CurrentWeather as CurrentWeatherType, GeoResult } from '@/lib/types';

// Mock WeatherIcon component
jest.mock('../WeatherIcon', () => {
  return function MockWeatherIcon({ weatherCode, size }: any) {
    return (
      <div data-testid="weather-icon" data-weather-code={weatherCode} data-size={size}>
        Mock Icon {weatherCode}
      </div>
    );
  };
});

// Mock weather-codes module
jest.mock('@/lib/weather-codes', () => ({
  getWeatherInfo: jest.fn((code: number) => ({
    description: `Weather ${code}`,
    emoji: '🌤️'
  }))
}));

describe('CurrentWeather', () => {
  const mockWeather: CurrentWeatherType = {
    temperature: 22.5,
    feelsLike: 24.1,
    humidity: 65,
    windSpeed: 10.2,
    weatherCode: 1
  };

  const mockCity: GeoResult = {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    admin1: 'England'
  };

  it('should render city information correctly', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('London, England')).toBeInTheDocument();
    expect(screen.getByText('United Kingdom')).toBeInTheDocument();
  });

  it('should render city without admin1', () => {
    const cityWithoutAdmin1 = { ...mockCity, admin1: undefined };
    render(<CurrentWeather weather={mockWeather} city={cityWithoutAdmin1} unit="celsius" />);
    
    expect(screen.getByText('London')).toBeInTheDocument();
    expect(screen.queryByText('London,')).not.toBeInTheDocument();
  });

  it('should display temperature in celsius', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('23°C')).toBeInTheDocument(); // Rounded from 22.5
    expect(screen.getByText('Feels like 24°C')).toBeInTheDocument(); // Rounded from 24.1
  });

  it('should display temperature in fahrenheit', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="fahrenheit" />);
    
    expect(screen.getByText('73°F')).toBeInTheDocument(); // 22.5°C = 72.5°F ≈ 73°F
    expect(screen.getByText('Feels like 75°F')).toBeInTheDocument(); // 24.1°C = 75.38°F ≈ 75°F
  });

  it('should display weather details correctly', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('Humidity: 65%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 10 km/h')).toBeInTheDocument(); // Rounded from 10.2
  });

  it('should render weather icon with correct props', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    const weatherIcon = screen.getByTestId('weather-icon');
    expect(weatherIcon).toHaveAttribute('data-weather-code', '1');
    expect(weatherIcon).toHaveAttribute('data-size', 'lg');
  });

  it('should display weather description', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('Weather 1')).toBeInTheDocument();
  });

  it('should apply correct gradient based on weather code', () => {
    const { container, rerender } = render(
      <CurrentWeather weather={{ ...mockWeather, weatherCode: 0 }} city={mockCity} unit="celsius" />
    );
    
    // Clear sky should have blue gradient
    expect(container.querySelector('.bg-gradient-to-br.from-blue-400.to-blue-600')).toBeInTheDocument();
    
    // Test rainy weather
    rerender(
      <CurrentWeather weather={{ ...mockWeather, weatherCode: 61 }} city={mockCity} unit="celsius" />
    );
    expect(container.querySelector('.bg-gradient-to-br.from-gray-600.to-gray-800')).toBeInTheDocument();
    
    // Test thunderstorm
    rerender(
      <CurrentWeather weather={{ ...mockWeather, weatherCode: 95 }} city={mockCity} unit="celsius" />
    );
    expect(container.querySelector('.bg-gradient-to-br.from-gray-800.to-black')).toBeInTheDocument();
  });

  it('should handle extreme temperatures', () => {
    const extremeWeather: CurrentWeatherType = {
      temperature: -15.7,
      feelsLike: -20.3,
      humidity: 90,
      windSpeed: 25.8,
      weatherCode: 71
    };
    
    render(<CurrentWeather weather={extremeWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('-16°C')).toBeInTheDocument();
    expect(screen.getByText('Feels like -20°C')).toBeInTheDocument();
    expect(screen.getByText('Wind: 26 km/h')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroWeather: CurrentWeatherType = {
      temperature: 0,
      feelsLike: 0,
      humidity: 0,
      windSpeed: 0,
      weatherCode: 2
    };
    
    render(<CurrentWeather weather={zeroWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('0°C')).toBeInTheDocument();
    expect(screen.getByText('Feels like 0°C')).toBeInTheDocument();
    expect(screen.getByText('Humidity: 0%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 0 km/h')).toBeInTheDocument();
  });

  it('should apply correct CSS classes', () => {
    const { container } = render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    const mainContainer = container.firstChild;
    expect(mainContainer).toHaveClass('rounded-lg', 'p-8', 'text-white', 'shadow-lg');
    
    const gridContainer = container.querySelector('.grid.grid-cols-1.md\\:grid-cols-2');
    expect(gridContainer).toBeInTheDocument();
    expect(gridContainer).toHaveClass('gap-6');
  });

  it('should handle different weather code categories', () => {
    const weatherCodes = [
      { code: 0, expectedGradient: 'from-blue-400 to-blue-600' },
      { code: 3, expectedGradient: 'from-gray-400 to-gray-600' },
      { code: 61, expectedGradient: 'from-gray-600 to-gray-800' },
      { code: 71, expectedGradient: 'from-blue-200 to-blue-400' },
      { code: 95, expectedGradient: 'from-gray-800 to-black' },
      { code: 999, expectedGradient: 'from-blue-400 to-blue-600' } // Unknown code defaults to clear
    ];
    
    weatherCodes.forEach(({ code, expectedGradient }) => {
      const { container, unmount } = render(
        <CurrentWeather weather={{ ...mockWeather, weatherCode: code }} city={mockCity} unit="celsius" />
      );
      
      const gradientClasses = expectedGradient.split(' ');
      const gradientElement = container.querySelector(`.bg-gradient-to-br.${gradientClasses[0]}.${gradientClasses[1]}`);
      expect(gradientElement).toBeInTheDocument();
      
      unmount();
    });
  });

  it('should handle high humidity and wind speed', () => {
    const highValuesWeather: CurrentWeatherType = {
      temperature: 35.0,
      feelsLike: 42.0,
      humidity: 95,
      windSpeed: 50.7,
      weatherCode: 82
    };
    
    render(<CurrentWeather weather={highValuesWeather} city={mockCity} unit="celsius" />);
    
    expect(screen.getByText('Humidity: 95%')).toBeInTheDocument();
    expect(screen.getByText('Wind: 51 km/h')).toBeInTheDocument();
  });

  it('should be responsive', () => {
    const { container } = render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    expect(container.querySelector('.md\\:grid-cols-2')).toBeInTheDocument();
  });

  it('should maintain proper text hierarchy', () => {
    render(<CurrentWeather weather={mockWeather} city={mockCity} unit="celsius" />);
    
    const cityName = screen.getByText('London, England');
    expect(cityName).toHaveClass('text-3xl', 'font-bold');
    
    const temperature = screen.getByText('23°C');
    expect(temperature).toHaveClass('text-5xl', 'font-bold');
    
    const description = screen.getByText('Weather 1');
    expect(description).toHaveClass('text-xl');
  });
});