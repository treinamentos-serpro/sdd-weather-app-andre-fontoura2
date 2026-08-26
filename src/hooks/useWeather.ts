import { useCallback, useEffect, useRef, useState } from 'react';
import { getWeather, searchCities, WeatherServiceError } from '../services/weatherService';
import type { City, WeatherData } from '../types/weather';

export type WeatherState = 'idle' | 'loading' | 'success' | 'error' | 'empty';

type LastAction =
  | { type: 'search'; query: string }
  | { type: 'select'; city: City };

interface UseWeatherResult {
  state: WeatherState;
  data: WeatherData | null;
  cities: City[];
  error: string | null;
  search: (query: string) => Promise<void>;
  selectCity: (city: City) => Promise<void>;
  retry: () => Promise<void>;
}

const GENERIC_ERROR_MESSAGE = 'Não foi possível obter os dados. Tente novamente.';

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function toFriendlyMessage(error: unknown): string {
  if (error instanceof WeatherServiceError) {
    return error.message;
  }
  return GENERIC_ERROR_MESSAGE;
}

/** Orquestra busca de cidades e previsão, mantendo a máquina de estados da aplicação. */
export function useWeather(): UseWeatherResult {
  const [state, setState] = useState<WeatherState>('idle');
  const [data, setData] = useState<WeatherData | null>(null);
  const [cities, setCities] = useState<City[]>([]);
  const [error, setError] = useState<string | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastActionRef = useRef<LastAction | null>(null);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const selectCity = useCallback(async (city: City): Promise<void> => {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    lastActionRef.current = { type: 'select', city };

    setState('loading');
    setError(null);

    try {
      const weatherData = await getWeather(city.latitude, city.longitude, city, {
        signal: controller.signal,
      });
      setData(weatherData);
      setCities([]);
      setState('success');
    } catch (cause) {
      if (isAbortError(cause)) {
        return;
      }
      setError(toFriendlyMessage(cause));
      setState('error');
    }
  }, []);

  const search = useCallback(
    async (query: string): Promise<void> => {
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;
      lastActionRef.current = { type: 'search', query };

      setState('loading');
      setError(null);
      setCities([]);

      let results: City[];
      try {
        results = await searchCities(query, { signal: controller.signal });
      } catch (cause) {
        if (isAbortError(cause)) {
          return;
        }
        setError(toFriendlyMessage(cause));
        setState('error');
        return;
      }

      if (results.length === 0) {
        setState('empty');
        return;
      }

      if (results.length === 1) {
        await selectCity(results[0]);
        return;
      }

      setCities(results);
      setState('idle');
    },
    [selectCity],
  );

  const retry = useCallback(async (): Promise<void> => {
    const lastAction = lastActionRef.current;
    if (lastAction === null) {
      return;
    }
    if (lastAction.type === 'search') {
      await search(lastAction.query);
      return;
    }
    await selectCity(lastAction.city);
  }, [search, selectCity]);

  return { state, data, cities, error, search, selectCity, retry };
}
