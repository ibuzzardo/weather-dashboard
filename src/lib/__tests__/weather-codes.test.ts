import { getWeatherInfo, weatherCodes } from '../weather-codes';

describe('weather-codes', () => {
  describe('weatherCodes object', () => {
    it('should contain all expected weather codes', () => {
      const expectedCodes = [
        0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67,
        71, 73, 75, 77, 80, 81, 82, 85, 86, 95, 96, 99
      ];

      expectedCodes.forEach(code => {
        expect(weatherCodes[code]).toBeDefined();
        expect(weatherCodes[code]).toHaveProperty('description');
        expect(weatherCodes[code]).toHaveProperty('emoji');
      });
    });

    it('should have valid structure for each weather code', () => {
      Object.entries(weatherCodes).forEach(([code, info]) => {
        expect(typeof code).toBe('string');
        expect(typeof info.description).toBe('string');
        expect(typeof info.emoji).toBe('string');
        expect(info.description.length).toBeGreaterThan(0);
        expect(info.emoji.length).toBeGreaterThan(0);
      });
    });

    it('should have unique descriptions', () => {
      const descriptions = Object.values(weatherCodes).map(info => info.description);
      const uniqueDescriptions = new Set(descriptions);
      expect(uniqueDescriptions.size).toBe(descriptions.length);
    });
  });

  describe('getWeatherInfo', () => {
    it('should return correct info for valid weather codes', () => {
      expect(getWeatherInfo(0)).toEqual({
        description: 'Clear sky',
        emoji: '☀️'
      });

      expect(getWeatherInfo(61)).toEqual({
        description: 'Slight rain',
        emoji: '🌧️'
      });

      expect(getWeatherInfo(95)).toEqual({
        description: 'Thunderstorm',
        emoji: '⛈️'
      });
    });

    it('should return unknown info for invalid weather codes', () => {
      expect(getWeatherInfo(999)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });

      expect(getWeatherInfo(-1)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });

      expect(getWeatherInfo(50)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });
    });

    it('should handle edge cases', () => {
      expect(getWeatherInfo(0)).toBeDefined();
      expect(getWeatherInfo(99)).toBeDefined();
      
      // Test with undefined/null (TypeScript should prevent this, but testing runtime)
      expect(getWeatherInfo(undefined as any)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });

      expect(getWeatherInfo(null as any)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });
    });

    it('should handle string inputs gracefully', () => {
      expect(getWeatherInfo('0' as any)).toEqual({
        description: 'Unknown',
        emoji: '❓'
      });
    });

    it('should return consistent results for same input', () => {
      const result1 = getWeatherInfo(1);
      const result2 = getWeatherInfo(1);
      expect(result1).toEqual(result2);
      expect(result1).not.toBe(result2); // Different object instances
    });
  });

  describe('weather code categories', () => {
    it('should have clear weather codes', () => {
      const clearCodes = [0, 1];
      clearCodes.forEach(code => {
        const info = getWeatherInfo(code);
        expect(info.description.toLowerCase()).toMatch(/clear|mainly clear/);
      });
    });

    it('should have cloudy weather codes', () => {
      const cloudyCodes = [2, 3];
      cloudyCodes.forEach(code => {
        const info = getWeatherInfo(code);
        expect(info.description.toLowerCase()).toMatch(/cloudy|overcast/);
      });
    });

    it('should have rain weather codes', () => {
      const rainCodes = [51, 53, 55, 61, 63, 65, 80, 81, 82];
      rainCodes.forEach(code => {
        const info = getWeatherInfo(code);
        expect(info.description.toLowerCase()).toMatch(/rain|drizzle|shower/);
      });
    });

    it('should have snow weather codes', () => {
      const snowCodes = [71, 73, 75, 77, 85, 86];
      snowCodes.forEach(code => {
        const info = getWeatherInfo(code);
        expect(info.description.toLowerCase()).toMatch(/snow/);
      });
    });

    it('should have thunderstorm weather codes', () => {
      const thunderCodes = [95, 96, 99];
      thunderCodes.forEach(code => {
        const info = getWeatherInfo(code);
        expect(info.description.toLowerCase()).toMatch(/thunderstorm/);
      });
    });
  });
});