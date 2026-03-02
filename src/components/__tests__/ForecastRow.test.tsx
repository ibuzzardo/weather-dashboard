import { render, screen } from '@testing-library/react';
import ForecastRow from '../ForecastRow';
import type { DailyForecast } from '@/lib/types';

// Mock ForecastCard component
jest.mock('../ForecastCard', () => {
  return function MockForecastCard({ forecast, unit }: any) {
    return (
      <div data-testid="forecast-card" data-date={forecast.date} data-unit={unit}>
        {forecast.date} - {forecast.tempMax}°/{forecast.tempMin}° - {unit}
      </div>
    );
  };
});

describe('ForecastRow', () => {
  const mockForecast: DailyForecast[] = [
    {
      date: '2024-01-15',
      tempMax: 22.5,
      tempMin: 15.2,
      weatherCode: 1
    },
    {
      date: '2024-01-16',
      tempMax: 24.1,
      tempMin: 16.8,
      weatherCode: 2
    },
    {
      date: '2024-01-17',
      tempMax: 19.8,
      tempMin: 12.4,
      weatherCode: 61
    },
    {
      date: '2024-01-18',
      tempMax: 21.3,
      tempMin: 14.9,
      weatherCode: 3
    },
    {
      date: '2024-01-19',
      tempMax: 23.7,
      tempMin: 17.1,
      weatherCode: 0
    }
  ];

  it('should render forecast row with title', () => {
    render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
    expect(screen.getByText('5-Day Forecast')).toHaveClass('text-2xl', 'font-bold', 'text-gray-900', 'mb-4');
  });

  it('should render all forecast cards', () => {
    render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    const forecastCards = screen.getAllByTestId('forecast-card');
    expect(forecastCards).toHaveLength(5);
  });

  it('should pass correct props to forecast cards', () => {
    render(<ForecastRow forecast={mockForecast} unit="fahrenheit" />);
    
    const forecastCards = screen.getAllByTestId('forecast-card');
    
    forecastCards.forEach((card, index) => {
      expect(card).toHaveAttribute('data-date', mockForecast[index].date);
      expect(card).toHaveAttribute('data-unit', 'fahrenheit');
    });
  });

  it('should handle empty forecast array', () => {
    render(<ForecastRow forecast={[]} unit="celsius" />);
    
    expect(screen.getByText('5-Day Forecast')).toBeInTheDocument();
    expect(screen.queryAllByTestId('forecast-card')).toHaveLength(0);
  });

  it('should handle single day forecast', () => {
    const singleDayForecast = [mockForecast[0]];
    render(<ForecastRow forecast={singleDayForecast} unit="celsius" />);
    
    expect(screen.getAllByTestId('forecast-card')).toHaveLength(1);
  });

  it('should handle more than 5 days forecast', () => {
    const extendedForecast = [
      ...mockForecast,
      {
        date: '2024-01-20',
        tempMax: 25.0,
        tempMin: 18.0,
        weatherCode: 1
      },
      {
        date: '2024-01-21',
        tempMax: 26.0,
        tempMin: 19.0,
        weatherCode: 2
      }
    ];
    
    render(<ForecastRow forecast={extendedForecast} unit="celsius" />);
    
    expect(screen.getAllByTestId('forecast-card')).toHaveLength(7);
  });

  it('should apply correct CSS classes to container', () => {
    render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    const container = screen.getByText('5-Day Forecast').parentElement;
    expect(container).toHaveClass('w-full');
    
    const forecastContainer = screen.getAllByTestId('forecast-card')[0].parentElement;
    expect(forecastContainer).toHaveClass('flex', 'gap-4', 'overflow-x-auto', 'pb-4');
  });

  it('should generate unique keys for forecast cards', () => {
    render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    const forecastCards = screen.getAllByTestId('forecast-card');
    
    // Each card should have unique content based on date
    const cardContents = forecastCards.map(card => card.textContent);
    const uniqueContents = new Set(cardContents);
    expect(uniqueContents.size).toBe(cardContents.length);
  });

  it('should handle forecast with duplicate dates', () => {
    const duplicateDateForecast = [
      mockForecast[0],
      { ...mockForecast[0], tempMax: 25.0 }, // Same date, different temp
      mockForecast[2]
    ];
    
    render(<ForecastRow forecast={duplicateDateForecast} unit="celsius" />);
    
    expect(screen.getAllByTestId('forecast-card')).toHaveLength(3);
  });

  it('should work with both celsius and fahrenheit units', () => {
    const { rerender } = render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    let forecastCards = screen.getAllByTestId('forecast-card');
    forecastCards.forEach(card => {
      expect(card).toHaveAttribute('data-unit', 'celsius');
    });
    
    rerender(<ForecastRow forecast={mockForecast} unit="fahrenheit" />);
    
    forecastCards = screen.getAllByTestId('forecast-card');
    forecastCards.forEach(card => {
      expect(card).toHaveAttribute('data-unit', 'fahrenheit');
    });
  });

  it('should maintain responsive design classes', () => {
    render(<ForecastRow forecast={mockForecast} unit="celsius" />);
    
    const forecastContainer = screen.getAllByTestId('forecast-card')[0].parentElement;
    expect(forecastContainer).toHaveClass('overflow-x-auto');
  });

  it('should handle forecast with missing or invalid data gracefully', () => {
    const invalidForecast = [
      {
        date: '2024-01-15',
        tempMax: NaN,
        tempMin: 15.2,
        weatherCode: 1
      },
      {
        date: '',
        tempMax: 24.1,
        tempMin: 16.8,
        weatherCode: 2
      }
    ] as DailyForecast[];
    
    render(<ForecastRow forecast={invalidForecast} unit="celsius" />);
    
    expect(screen.getAllByTestId('forecast-card')).toHaveLength(2);
  });
});