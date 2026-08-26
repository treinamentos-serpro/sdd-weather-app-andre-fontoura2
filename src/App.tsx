import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import { mockWeatherData } from './lib/mockWeatherData';
import type { Unit } from './types/weather';

type Status = 'idle' | 'loading' | 'success' | 'error' | 'empty';

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const [status] = useState<Status>('success');

  function handleSearch(query: string): void {
    // TODO: integrar com useWeather na Entrega 2
    console.log(query);
  }

  function handleRetry(): void {
    // TODO: integrar com useWeather na Entrega 2
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">SDD Weather App</h1>
        </header>

        <SearchBar onSearch={handleSearch} />
        <UnitToggle unit={unit} onChange={setUnit} />

        {status === 'loading' && <LoadingState />}
        {status === 'error' && <ErrorState onRetry={handleRetry} />}
        {status === 'empty' && <EmptyState />}
        {status === 'success' && (
          <>
            <CurrentWeather
              city={mockWeatherData.city}
              current={mockWeatherData.current}
              unit={unit}
            />
            <ForecastList days={mockWeatherData.forecast} unit={unit} />
          </>
        )}
      </div>
    </div>
  );
}
