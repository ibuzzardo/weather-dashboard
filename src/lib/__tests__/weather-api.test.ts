import { fetchGeoResults, fetchWeatherData } from '../weather-api';
import type { GeoApiResponse, WeatherApiResponse } from '../types';

// Mock fetch globally
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('weather-api', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  describe('fetchGeoResults', () => {
    it('should fetch and return geo results successfully', async () => {
      const mockResponse: GeoApiResponse = {
        results: [
          {
            name: 'London',
            latitude: 51.5074,
            longitude: -0.1278,
            country: 'United Kingdom',
            admin1: 'England'
          },
          {
            name: 'London',
            latitude: 42.9834,
            longitude: -81.2497,
            country: 'Canada',
            admin1: 'Ontario'
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchGeoResults('London');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=London&count=5'
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        country: 'United Kingdom',
        admin1: 'England'
      });
    });

    it('should handle empty results', async () => {
      const mockResponse: GeoApiResponse = {
        results: []
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchGeoResults('NonexistentCity');
      expect(result).toEqual([]);
    });

    it('should handle missing results property', async () => {
      const mockResponse: GeoApiResponse = {};

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchGeoResults('InvalidCity');
      expect(result).toEqual([]);
    });

    it('should handle special characters in city name', async () => {
      const cityName = 'São Paulo';
      const mockResponse: GeoApiResponse = {
        results: [{
          name: 'São Paulo',
          latitude: -23.5505,
          longitude: -46.6333,
          country: 'Brazil'
        }]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      await fetchGeoResults(cityName);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://geocoding-api.open-meteo.com/v1/search?name=S%C3%A3o%20Paulo&count=5'
      );
    });

    it('should handle API error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
      } as Response);

      await expect(fetchGeoResults('London')).rejects.toThrow(
        'Failed to fetch city data: Geocoding API error: 500'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      await expect(fetchGeoResults('London')).rejects.toThrow(
        'Failed to fetch city data: Network error'
      );
    });

    it('should handle unknown errors', async () => {
      mockFetch.mockRejectedValueOnce('Unknown error');

      await expect(fetchGeoResults('London')).rejects.toThrow(
        'Failed to fetch city data: Unknown error'
      );
    });
  });

  describe('fetchWeatherData', () => {
    it('should fetch and return weather data successfully', async () => {
      const mockResponse: WeatherApiResponse = {
        current: {
          temperature_2m: 20.5,
          relative_humidity_2m: 65,
          apparent_temperature: 22.1,
          weather_code: 1,
          wind_speed_10m: 10.2
        },
        daily: {
          time: ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'],
          temperature_2m_max: [22.5, 24.1, 19.8, 21.3, 23.7],
          temperature_2m_min: [15.2, 16.8, 12.4, 14.9, 17.1],
          weather_code: [1, 2, 61, 3, 0]
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchWeatherData(51.5074, -0.1278);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5'
      );

      expect(result.current).toEqual({
        temperature: 20.5,
        feelsLike: 22.1,
        humidity: 65,
        windSpeed: 10.2,
        weatherCode: 1
      });

      expect(result.forecast).toHaveLength(5);
      expect(result.forecast[0]).toEqual({
        date: '2024-01-01',
        tempMax: 22.5,
        tempMin: 15.2,
        weatherCode: 1
      });
    });

    it('should handle extreme coordinates', async () => {
      const mockResponse: WeatherApiResponse = {
        current: {
          temperature_2m: -40.0,
          relative_humidity_2m: 90,
          apparent_temperature: -45.0,
          weather_code: 71,
          wind_speed_10m: 25.0
        },
        daily: {
          time: ['2024-01-01'],
          temperature_2m_max: [-35.0],
          temperature_2m_min: [-45.0],
          weather_code: [71]
        }
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      } as Response);

      const result = await fetchWeatherData(90, 180); // North Pole, extreme longitude

      expect(result.current.temperature).toBe(-40.0);
      expect(result.current.weatherCode).toBe(71);
    });

    it('should handle API error responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      } as Response);

      await expect(fetchWeatherData(51.5074, -0.1278)).rejects.toThrow(
        'Failed to fetch weather data: Weather API error: 404'
      );
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Connection timeout'));

      await expect(fetchWeatherData(51.5074, -0.1278)).rejects.toThrow(
        'Failed to fetch weather data: Connection timeout'
      );
    });

    it('should handle malformed JSON response', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => { throw new Error('Invalid JSON'); },
      } as Response);

      await expect(fetchWeatherData(51.5074, -0.1278)).rejects.toThrow(
        'Failed to fetch weather data: Invalid JSON'
      );
    });
  });
});