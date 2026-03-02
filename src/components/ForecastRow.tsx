'use client';

import ForecastCard from './ForecastCard';
import type { DailyForecast } from '@/lib/types';

interface ForecastRowProps {
  forecast: DailyForecast[];
  unit: 'celsius' | 'fahrenheit';
}

export default function ForecastRow({ forecast, unit }: ForecastRowProps): JSX.Element {
  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">5-Day Forecast</h2>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {forecast.map((day, index) => (
          <ForecastCard 
            key={`${day.date}-${index}`} 
            forecast={day} 
            unit={unit} 
          />
        ))}
      </div>
    </div>
  );
}