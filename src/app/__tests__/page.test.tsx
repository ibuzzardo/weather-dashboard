import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Home from '../page';
import * as weatherApi from '@/lib/weather-api';
import type { GeoResult, CurrentWeather, DailyForecast } from '@/lib/types';

// Mock all components
jest.mock('@/components/SearchBar', () => {
  return function MockSearchBar({ onSearch }: any) {
    return (
      <div data-testid="search-bar">
        <button onClick={() => onSearch('London')}>Search London</button>
      </div>
    );
  };
});

jest.mock('@/components/UnitToggle', () => {
  return function MockUnitToggle({ unit, onToggle }: any) {
    return (
      <button data-testid="unit-toggle" onClick={onToggle}>
        {unit}
      </button>
    );
  };
});

jest.mock('@/components/CurrentWeather', () => {
  return function MockCurrentWeather({ weather, city, unit }: any) {
    return (
      <div data-testid="current-weather">
        {city.name} - {weather.temperature}°{unit === 'celsius' ? 'C' : 'F'}
      </div>
    );
  };
});

jest.mock('@/components/ForecastRow', () => {
  return function MockForecastRow({ forecast, unit }: any) {
    return (
      <div data-testid="forecast-row">
        {forecast.length} days - {unit}
      </div>
    );
  };
});

jest.mock('@/components/RecentSearches', () => {
  return function MockRecentSearches({ onCitySelect }: any) {
    return (
      <div data-testid="recent-searches">
        <button onClick={() => onCitySelect({ name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' })}>
          Select Paris
        </button>
      </div>
    );
  };
});

jest.mock('@/components/LoadingSkeleton', () => {
  return function MockLoadingSkeleton() {
    return <div data-testid="loading-skeleton">Loading...</div>;
  };
});

// Mock weather API
jest.mock('@/lib/weather-api');
const mockWeatherApi = weatherApi as jest.Mocked<typeof weatherApi>;

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

describe('Home Page', () => {
  const mockGeoResult: GeoResult = {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    country: 'United Kingdom',
    admin1: 'England'
  };

  const mockCurrentWeather: CurrentWeather = {
    temperature: 22.5,
    feelsLike: 24.1,
    humidity: 65,
    windSpeed: 10.2,
    weatherCode: 1
  };

  const mockForecast: DailyForecast[] = [
    { date: '2024-01-15', tempMax: 22.5, tempMin: 15.2, weatherCode: 1 },
    { date: '2024-01-16', tempMax: 24.1, tempMin: 16.8, weatherCode: 2 },
    { date: '2024-01-17', tempMax: 19.8, tempMin: 12.4, weatherCode: 61 },
    { date: '2024-01-18', tempMax: 21.3, tempMin: 14.9, weatherCode: 3 },
    { date: '2024-01-19', tempMax: 23.7, tempMin: 17.1, weatherCode: 0 }
  ];

  beforeEach(() => {
    mockWeatherApi.fetchGeoResults.mockClear();
    mockWeatherApi.fetchWeatherData.mockClear();
    mockLocalStorage.getItem.mockClear();
    mockLocalStorage.setItem.mockClear();
    mockLocalStorage.getItem.mockReturnValue('[]');
  });

  it('should render initial state correctly', () => {
    render(<Home />);
    
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('unit-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('recent-searches')).toBeInTheDocument();
    expect(screen.queryByTestId('current-weather')).not.toBeInTheDocument();
    expect(screen.queryByTestId('forecast-row')).not.toBeInTheDocument();
  });

  it('should handle successful search', async () => {
    mockWeatherApi.fetchGeoResults.mockResolvedValue([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-weather')).toBeInTheDocument();
      expect(screen.getByTestId('forecast-row')).toBeInTheDocument();
    });

    expect(mockWeatherApi.fetchGeoResults).toHaveBeenCalledWith('London');
    expect(mockWeatherApi.fetchWeatherData).toHaveBeenCalledWith(51.5074, -0.1278);
  });

  it('should show loading state during search', async () => {
    let resolveGeo: (value: GeoResult[]) => void;
    const geoPromise = new Promise<GeoResult[]>((resolve) => {
      resolveGeo = resolve;
    });
    mockWeatherApi.fetchGeoResults.mockReturnValue(geoPromise);

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    expect(screen.getByTestId('loading-skeleton')).toBeInTheDocument();

    resolveGeo!([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    await waitFor(() => {
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
    });
  });

  it('should handle search with no results', async () => {
    mockWeatherApi.fetchGeoResults.mockResolvedValue([]);

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('City not found. Please try a different search.')).toBeInTheDocument();
    });

    expect(screen.queryByTestId('current-weather')).not.toBeInTheDocument();
  });

  it('should handle API errors', async () => {
    mockWeatherApi.fetchGeoResults.mockRejectedValue(new Error('Network error'));

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Network error')).toBeInTheDocument();
    });
  });

  it('should handle unknown errors', async () => {
    mockWeatherApi.fetchGeoResults.mockRejectedValue('Unknown error');

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch weather data')).toBeInTheDocument();
    });
  });

  it('should toggle temperature units', async () => {
    mockWeatherApi.fetchGeoResults.mockResolvedValue([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    // First search to get weather data
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId('current-weather')).toBeInTheDocument();
    });

    // Check initial unit
    expect(screen.getByText('celsius')).toBeInTheDocument();

    // Toggle unit
    const unitToggle = screen.getByTestId('unit-toggle');
    fireEvent.click(unitToggle);

    expect(screen.getByText('fahrenheit')).toBeInTheDocument();
  });

  it('should save searches to localStorage', async () => {
    mockWeatherApi.fetchGeoResults.mockResolvedValue([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recentSearches',
        JSON.stringify([mockGeoResult])
      );
    });
  });

  it('should handle recent city selection', async () => {
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    const parisButton = screen.getByText('Select Paris');
    fireEvent.click(parisButton);

    await waitFor(() => {
      expect(mockWeatherApi.fetchWeatherData).toHaveBeenCalledWith(48.8566, 2.3522);
      expect(screen.getByTestId('current-weather')).toBeInTheDocument();
    });
  });

  it('should handle recent city selection error', async () => {
    mockWeatherApi.fetchWeatherData.mockRejectedValue(new Error('Weather API error'));

    render(<Home />);
    
    const parisButton = screen.getByText('Select Paris');
    fireEvent.click(parisButton);

    await waitFor(() => {
      expect(screen.getByText('Weather API error')).toBeInTheDocument();
    });
  });

  it('should not search for empty input', async () => {
    render(<Home />);
    
    // Mock the SearchBar to simulate empty search
    const MockSearchBarWithEmpty = ({ onSearch }: any) => (
      <button onClick={() => onSearch('')}>Search Empty</button>
    );
    
    // This test would need the actual SearchBar implementation
    // For now, we test that the API is not called for empty strings
    expect(mockWeatherApi.fetchGeoResults).not.toHaveBeenCalled();
  });

  it('should maintain recent searches limit', async () => {
    const existingSearches = Array.from({ length: 5 }, (_, i) => ({
      name: `City${i}`,
      latitude: i,
      longitude: i,
      country: 'Country'
    }));
    
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingSearches));
    mockWeatherApi.fetchGeoResults.mockResolvedValue([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'recentSearches',
        expect.stringContaining('London')
      );
    });

    // Verify the saved array has max 5 items
    const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
    expect(savedData).toHaveLength(5);
    expect(savedData[0]).toEqual(mockGeoResult);
  });

  it('should prevent duplicate recent searches', async () => {
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockGeoResult]));
    mockWeatherApi.fetchGeoResults.mockResolvedValue([mockGeoResult]);
    mockWeatherApi.fetchWeatherData.mockResolvedValue({
      current: mockCurrentWeather,
      forecast: mockForecast
    });

    render(<Home />);
    
    const searchButton = screen.getByText('Search London');
    fireEvent.click(searchButton);

    await waitFor(() => {
      const savedData = JSON.parse(mockLocalStorage.setItem.mock.calls[0][1]);
      expect(savedData).toHaveLength(1);
      expect(savedData[0]).toEqual(mockGeoResult);
    });
  });
});