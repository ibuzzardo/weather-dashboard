# Weather Dashboard

> Built with [Dark Factory v4](https://github.com/ibuzzardo/dark-factory-v4) — autonomous AI software development pipeline

**[Live Demo](https://weather-dashboard-brown-zeta.vercel.app)**


A responsive Next.js weather dashboard that displays current weather conditions and a 5-day forecast for any city using the Open-Meteo API.

## Features

- 🔍 **City Search**: Search for any city with debounced API calls
- 🌡️ **Current Weather**: Temperature, feels-like, humidity, wind speed, and weather conditions
- 📅 **5-Day Forecast**: Daily high/low temperatures with weather icons
- 🌡️ **Unit Toggle**: Switch between Celsius and Fahrenheit
- 📱 **Responsive Design**: Mobile-first approach with breakpoints at 320px, 768px, and 1280px
- 💾 **Recent Searches**: Last 5 searched cities stored in localStorage
- 🎨 **Dynamic Backgrounds**: Gradient backgrounds that change based on weather conditions
- ⚡ **Loading States**: Skeleton loading animations
- 🚫 **Error Handling**: Graceful error handling for API failures

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **API**: Open-Meteo (free, no API key required)
- **State Management**: React hooks (client-side only)
- **Font**: Inter

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ibuzzardo/weather-dashboard.git
cd weather-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## API Endpoints

This project uses the free Open-Meteo API:

- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **Weather**: `https://api.open-meteo.com/v1/forecast`

No API key is required.

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Inter font
│   ├── page.tsx            # Main page with state management
│   └── globals.css         # Tailwind CSS imports
├── components/
│   ├── SearchBar.tsx       # Debounced city search
│   ├── CurrentWeather.tsx  # Current conditions display
│   ├── ForecastCard.tsx    # Single day forecast
│   ├── ForecastRow.tsx     # 5-day forecast row
│   ├── UnitToggle.tsx      # Celsius/Fahrenheit toggle
│   ├── RecentSearches.tsx  # Recent city chips
│   ├── WeatherIcon.tsx     # Weather code to emoji mapper
│   └── LoadingSkeleton.tsx # Loading animations
└── lib/
    ├── types.ts            # TypeScript interfaces
    ├── weather-api.ts      # API functions
    └── weather-codes.ts    # WMO weather code mappings
```

## Responsive Testing

Test the application at these breakpoints:
- **Mobile**: 320px
- **Tablet**: 768px  
- **Desktop**: 1280px

## Environment Variables

Currently no environment variables are needed as the Open-Meteo API is free and public. A `.env.example` file is included for future use.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test at all responsive breakpoints
5. Submit a pull request

## License

MIT License - see LICENSE file for details.