'use client';

import { useState, useCallback } from 'react';
import debounce from 'lodash.debounce';

interface SearchBarProps {
  onSearch: (cityName: string) => Promise<void>;
}

export default function SearchBar({ onSearch }: SearchBarProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>('');
  const [isSearching, setIsSearching] = useState<boolean>(false);

  const debouncedSearch = useCallback(
    debounce(async (searchTerm: string) => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          await onSearch(searchTerm);
        } finally {
          setIsSearching(false);
        }
      }
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value;
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (inputValue.trim()) {
      setIsSearching(true);
      try {
        await onSearch(inputValue);
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Search for a city..."
          className="w-full px-4 py-2 border border-muted rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          disabled={isSearching}
        />
        {isSearching && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
          </div>
        )}
      </div>
    </form>
  );
}