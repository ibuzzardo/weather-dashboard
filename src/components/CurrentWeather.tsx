'use client';

import WeatherIcon from './WeatherIcon';
import type { CurrentWeather, GeoResult } from '@/lib/types';
import { getWeatherInfo } from '@/lib/weather-codes';

interface CurrentWeatherProps {
  weather: CurrentWeather;
  city: GeoResult;
  unit: 'celsius' | 'fahrenheit';
}

function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  return unit === 'fahrenheit' ? (celsius * 9/5) + 32 : celsius;
}

function getGradientClass(weatherCode: number): string {
  const weatherInfo = getWeatherInfo(weatherCode);
  
  if (weatherCode === 0 || weatherCode === 1) {
    return 'bg-gradient-to-br from-blue-400 to-blue-600';
  } else if (weatherCode === 2 || weatherCode === 3) {
    return 'bg-gradient-to-br from-gray-400 to-gray-600';
  } else if (weatherCode >= 61 && weatherCode <= 67) {
    return 'bg-gradient-to-br from-gray-600 to-gray-800';
  } else if (weatherCode >= 71 && weatherCode <= 77) {
    return 'bg-gradient-to-br from-blue-200 to-blue-400';
  } else if (weatherCode >= 95) {
    return 'bg-gradient-to-br from-gray-800 to-black';
  }
  
  return 'bg-gradient-to-br from-blue-400 to-blue-600';
}

export default function CurrentWeather({ weather, city, unit }: CurrentWeatherProps): JSX.Element {
  const weatherInfo = getWeatherInfo(weather.weatherCode);
  const gradientClass = getGradientClass(weather.weatherCode);
  
  const temperature = Math.round(convertTemp(weather.temperature, unit));
  const feelsLike = Math.round(convertTemp(weather.feelsLike, unit));
  const windSpeed = Math.round(weather.windSpeed);
  
  return (
    <div className={`${gradientClass} rounded-lg p-8 text-white shadow-lg`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-3xl font-bold">
              {city.name}
              {city.admin1 && `, ${city.admin1}`}
            </h1>
            <p className="text-white/80">{city.country}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <WeatherIcon weatherCode={weather.weatherCode} size="lg" />
            <div>
              <div className="text-5xl font-bold">
                {temperature}°{unit === 'celsius' ? 'C' : 'F'}
              </div>
              <div className="text-white/80">
                Feels like {feelsLike}°{unit === 'celsius' ? 'C' : 'F'}
              </div>
            </div>
          </div>
          
          <p className="text-xl text-white/90">{weatherInfo.description}</p>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-white/80">Humidity</span>
            <span className="font-semibold">{weather.humidity}%</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-white/80">Wind Speed</span>
            <span className="font-semibold">{windSpeed} km/h</span>
          </div>
          
          <div className="flex justify-between items-center py-2 border-b border-white/20">
            <span className="text-white/80">Weather Code</span>
            <span className="font-semibold">{weather.weatherCode}</span>
          </div>
          
          <div className="flex justify-between items-center py-2">
            <span className="text-white/80">Condition</span>
            <span className="font-semibold">{weatherInfo.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
}