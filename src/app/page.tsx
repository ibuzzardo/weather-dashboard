'use client';

import { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import UnitToggle from '@/components/UnitToggle';
import CurrentWeather from '@/components/CurrentWeather';
import ForecastRow from '@/components/ForecastRow';
import RecentSearches from '@/components/RecentSearches';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { fetchGeoResults, fetchWeatherData } from '@/lib/weather-api';
import type { GeoResult, CurrentWeather as CurrentWeatherType, DailyForecast } from '@/lib/types';

type Unit = 'celsius' | 'fahrenheit';

interface WeatherData {
  current: CurrentWeatherType;
  forecast: DailyForecast[];
}

export default function Home(): JSX.Element {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [selectedCity, setSelectedCity] = useState<GeoResult | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (cityName: string): Promise<void> => {
    if (!cityName.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const geoResults = await fetchGeoResults(cityName);
      if (geoResults.length === 0) {
        setError('City not found. Please try a different search.');
        return;
      }

      const city = geoResults[0];
      setSelectedCity(city);

      const weather = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(weather);

      // Save to recent searches
      const recentSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]') as GeoResult[];
      const filteredSearches = recentSearches.filter(search => 
        !(search.latitude === city.latitude && search.longitude === city.longitude)
      );
      const updatedSearches = [city, ...filteredSearches].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleRecentCitySelect = async (city: GeoResult): Promise<void> => {
    setLoading(true);
    setError(null);
    setSelectedCity(city);

    try {
      const weather = await fetchWeatherData(city.latitude, city.longitude);
      setWeatherData(weather);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const toggleUnit = (): void => {
    setUnit(prev => prev === 'celsius' ? 'fahrenheit' : 'celsius');
  };

  return (
    <div className="flex flex-col items-center p-6 min-h-screen">
      <div className="w-full max-w-4xl space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <SearchBar onSearch={handleSearch} />
          <UnitToggle unit={unit} onToggle={toggleUnit} />
        </div>

        <RecentSearches onCitySelect={handleRecentCitySelect} />

        {error && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-center">
            {error}
          </div>
        )}

        {loading && <LoadingSkeleton />}

        {!loading && weatherData && selectedCity && (
          <>
            <CurrentWeather 
              weather={weatherData.current}
              city={selectedCity}
              unit={unit}
            />
            <ForecastRow forecast={weatherData.forecast} unit={unit} />
          </>
        )}

        {!loading && !weatherData && !error && (
          <div className="text-center text-muted py-12">
            <h2 className="text-2xl font-semibold mb-2">Welcome to Weather Dashboard</h2>
            <p>Search for a city to see current weather and 5-day forecast</p>
          </div>
        )}
      </div>
    </div>
  );
}