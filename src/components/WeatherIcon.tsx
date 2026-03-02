'use client';

import { getWeatherInfo } from '@/lib/weather-codes';

interface WeatherIconProps {
  weatherCode: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function WeatherIcon({ 
  weatherCode, 
  size = 'md', 
  className = '' 
}: WeatherIconProps): JSX.Element {
  const weatherInfo = getWeatherInfo(weatherCode);
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <span 
      className={`${sizeClasses[size]} ${className}`}
      role="img"
      aria-label={weatherInfo.description}
      title={weatherInfo.description}
    >
      {weatherInfo.emoji}
    </span>
  );
}