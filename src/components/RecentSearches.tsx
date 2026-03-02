'use client';

import { useState, useEffect } from 'react';
import type { GeoResult } from '@/lib/types';

interface RecentSearchesProps {
  onCitySelect: (city: GeoResult) => Promise<void>;
}

export default function RecentSearches({ onCitySelect }: RecentSearchesProps): JSX.Element {
  const [recentSearches, setRecentSearches] = useState<GeoResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse recent searches:', error);
      }
    }
  }, []);

  const handleCityClick = async (city: GeoResult): Promise<void> => {
    setIsLoading(true);
    try {
      await onCitySelect(city);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, city: GeoResult): void => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCityClick(city);
    }
  };

  if (recentSearches.length === 0) {
    return <div></div>;
  }

  return (
    <div className="w-full">
      <h3 className="text-sm font-medium text-secondary mb-2">Recent Searches</h3>
      <div className="flex flex-wrap gap-2">
        {recentSearches.map((city, index) => (
          <button
            key={`${city.latitude}-${city.longitude}-${index}`}
            onClick={() => handleCityClick(city)}
            onKeyDown={(e) => handleKeyDown(e, city)}
            disabled={isLoading}
            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {city.name}
            {city.admin1 && `, ${city.admin1}`}
          </button>
        ))}
      </div>
    </div>
  );
}