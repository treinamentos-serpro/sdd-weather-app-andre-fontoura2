import { useState } from 'react';
import CurrentWeather from './components/CurrentWeather';
import ForecastList from './components/ForecastList';
import SearchBar from './components/SearchBar';
import UnitToggle from './components/UnitToggle';
import EmptyState from './components/states/EmptyState';
import ErrorState from './components/states/ErrorState';
import LoadingState from './components/states/LoadingState';
import { useWeather } from './hooks/useWeather';
import type { City, Unit } from './types/weather';

function cityLabel(city: City): string {
  return [city.name, city.admin1, city.country].filter(Boolean).join(', ');
}

export default function App() {
  const [unit, setUnit] = useState<Unit>('celsius');
  const { state, data, cities, error, search, selectCity, retry } = useWeather();

  function handleSearch(query: string): void {
    void search(query);
  }

  function handleRetry(): void {
    void retry();
  }

  return (
    <div className="min-h-screen bg-night-900 text-white">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-8 sm:px-6 sm:py-10">
        <header>
          <h1 className="text-2xl font-bold sm:text-3xl">SDD Weather App</h1>
        </header>

        <SearchBar onSearch={handleSearch} />
        <UnitToggle unit={unit} onChange={setUnit} />

        {state === 'loading' && <LoadingState />}
        {state === 'error' && <ErrorState message={error ?? undefined} onRetry={handleRetry} />}
        {state === 'empty' && <EmptyState />}
        {state === 'idle' && cities.length === 0 && (
          <p className="text-center text-slate-300">
            Busque uma cidade para ver a previsão do tempo.
          </p>
        )}
        {cities.length > 0 && (
          <ul className="flex flex-col gap-2">
            {cities.map((city) => (
              <li key={city.id}>
                <button
                  type="button"
                  onClick={() => selectCity(city)}
                  className="w-full rounded-lg border border-white/20 bg-white/10 px-4 py-2 text-left font-medium text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  {cityLabel(city)}
                </button>
              </li>
            ))}
          </ul>
        )}
        {state === 'success' && data && (
          <>
            <CurrentWeather city={data.city} current={data.current} unit={unit} />
            <ForecastList days={data.forecast} unit={unit} />
          </>
        )}
      </div>
    </div>
  );
}
