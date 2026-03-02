import WeatherIcon from './WeatherIcon';
import type { DailyForecast } from '@/lib/types';

interface ForecastCardProps {
  forecast: DailyForecast;
  unit: 'celsius' | 'fahrenheit';
}

function convertTemp(celsius: number, unit: 'celsius' | 'fahrenheit'): number {
  return unit === 'fahrenheit' ? (celsius * 9/5) + 32 : celsius;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }
}

export default function ForecastCard({ forecast, unit }: ForecastCardProps): JSX.Element {
  const tempMax = Math.round(convertTemp(forecast.tempMax, unit));
  const tempMin = Math.round(convertTemp(forecast.tempMin, unit));
  const unitSymbol = unit === 'celsius' ? 'C' : 'F';
  
  return (
    <div className="flex flex-col items-center p-4 bg-foreground shadow-md rounded-lg min-w-[140px]">
      <h3 className="text-sm font-medium text-secondary mb-2">
        {formatDate(forecast.date)}
      </h3>
      
      <WeatherIcon weatherCode={forecast.weatherCode} size="md" className="mb-3" />
      
      <div className="text-center space-y-1">
        <div className="text-lg font-bold text-gray-900">
          {tempMax}°{unitSymbol}
        </div>
        <div className="text-sm text-muted">
          {tempMin}°{unitSymbol}
        </div>
      </div>
    </div>
  );
}