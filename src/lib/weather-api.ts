import type { GeoResult, CurrentWeather, DailyForecast, WeatherApiResponse, GeoApiResponse } from './types';

export async function fetchGeoResults(cityName: string): Promise<GeoResult[]> {
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityName)}&count=5`
    );

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }

    const data: GeoApiResponse = await response.json();
    
    if (!data.results || data.results.length === 0) {
      return [];
    }

    return data.results.map(result => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1,
    }));
  } catch (error) {
    throw new Error(`Failed to fetch city data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function fetchWeatherData(
  latitude: number,
  longitude: number
): Promise<{ current: CurrentWeather; forecast: DailyForecast[] }> {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: WeatherApiResponse = await response.json();

    const current: CurrentWeather = {
      temperature: data.current.temperature_2m,
      feelsLike: data.current.apparent_temperature,
      humidity: data.current.relative_humidity_2m,
      windSpeed: data.current.wind_speed_10m,
      weatherCode: data.current.weather_code,
    };

    const forecast: DailyForecast[] = data.daily.time.map((date, index) => ({
      date,
      tempMax: data.daily.temperature_2m_max[index],
      tempMin: data.daily.temperature_2m_min[index],
      weatherCode: data.daily.weather_code[index],
    }));

    return { current, forecast };
  } catch (error) {
    throw new Error(`Failed to fetch weather data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}