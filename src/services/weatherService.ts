import type {
  City,
  CurrentWeather,
  ForecastDay,
  WeatherData,
} from '../types/weather';

const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const FORECAST_TIMEOUT_MS = 10_000;

/** Erro tipado para falhas de rede/HTTP no acesso à API da Open-Meteo. */
export class WeatherServiceError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message);
    this.name = 'WeatherServiceError';
    this.cause = options?.cause;
  }
}

interface GeocodingResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

interface GeocodingResponse {
  results?: GeocodingResult[];
}

interface SearchCitiesOptions {
  signal?: AbortSignal;
}

/**
 * Busca cidades pelo nome usando a API de geocoding da Open-Meteo.
 * Retorna `[]` para nome vazio ou quando nenhuma cidade é encontrada.
 */
export async function searchCities(
  name: string,
  options?: SearchCitiesOptions,
): Promise<City[]> {
  const trimmedName = name.trim();
  if (trimmedName === '') {
    return [];
  }

  const url = `${GEOCODING_URL}?name=${encodeURIComponent(trimmedName)}&count=5&language=pt&format=json`;

  let response: Response;
  try {
    response = await fetch(url, { signal: options?.signal });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }
    throw new WeatherServiceError('Falha de rede ao buscar cidades.', { cause });
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `Erro ao buscar cidades (HTTP ${response.status}).`,
    );
  }

  const data = (await response.json()) as GeocodingResponse;

  if (!data.results) {
    return [];
  }

  return data.results.map((result) => ({
    id: result.id,
    name: result.name,
    country: result.country,
    admin1: result.admin1,
    latitude: result.latitude,
    longitude: result.longitude,
  }));
}

interface ForecastCurrentResponse {
  time?: string;
  temperature_2m?: number;
  relative_humidity_2m?: number;
  wind_speed_10m?: number;
  surface_pressure?: number;
  precipitation?: number;
  weather_code?: number;
}

interface ForecastDailyResponse {
  time?: string[];
  weather_code?: number[];
  temperature_2m_max?: number[];
  temperature_2m_min?: number[];
  precipitation_probability_max?: number[];
}

interface ForecastResponse {
  current?: ForecastCurrentResponse;
  daily?: ForecastDailyResponse;
}

interface GetWeatherOptions {
  signal?: AbortSignal;
}

function mapCurrentWeather(current: ForecastCurrentResponse | undefined): CurrentWeather {
  if (
    current === undefined ||
    current.time === undefined ||
    current.temperature_2m === undefined ||
    current.relative_humidity_2m === undefined ||
    current.wind_speed_10m === undefined ||
    current.surface_pressure === undefined ||
    current.precipitation === undefined ||
    current.weather_code === undefined
  ) {
    throw new WeatherServiceError('Resposta da API de previsão incompleta (current).');
  }

  return {
    temperature: current.temperature_2m,
    weatherCode: current.weather_code,
    humidity: current.relative_humidity_2m,
    windSpeed: current.wind_speed_10m,
    pressure: current.surface_pressure,
    precipitation: current.precipitation,
    time: current.time,
  };
}

function mapForecastDays(daily: ForecastDailyResponse | undefined): ForecastDay[] {
  if (daily === undefined || daily.time === undefined) {
    throw new WeatherServiceError('Resposta da API de previsão incompleta (daily).');
  }

  const days: ForecastDay[] = [];

  for (let i = 0; i < daily.time.length; i += 1) {
    const date = daily.time[i];
    const max = daily.temperature_2m_max?.[i];
    const min = daily.temperature_2m_min?.[i];
    const weatherCode = daily.weather_code?.[i];
    const precipitationProbability = daily.precipitation_probability_max?.[i];

    // Dia com campos ausentes é ignorado em vez de propagar `undefined`.
    if (
      date === undefined ||
      max === undefined ||
      min === undefined ||
      weatherCode === undefined ||
      precipitationProbability === undefined
    ) {
      continue;
    }

    days.push({ date, min, max, weatherCode, precipitationProbability });
  }

  return days;
}

/**
 * Busca a previsão atual + próximos dias para uma coordenada na Open-Meteo.
 * Aplica timeout interno de 10s quando nenhum `signal` externo é fornecido.
 */
export async function getWeather(
  latitude: number,
  longitude: number,
  city: City,
  options?: GetWeatherOptions,
): Promise<WeatherData> {
  const url =
    `${FORECAST_URL}?latitude=${latitude}&longitude=${longitude}` +
    '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,surface_pressure,precipitation,weather_code' +
    '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max' +
    '&forecast_days=5&timezone=auto';

  const externalSignal = options?.signal;
  const timeoutController = externalSignal ? undefined : new AbortController();
  const signal = externalSignal ?? timeoutController?.signal;
  const timeoutId = timeoutController
    ? setTimeout(() => timeoutController.abort(), FORECAST_TIMEOUT_MS)
    : undefined;

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (cause) {
    if (timeoutController?.signal.aborted) {
      throw new WeatherServiceError('Tempo limite excedido ao buscar previsão.', { cause });
    }
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }
    throw new WeatherServiceError('Falha de rede ao buscar previsão.', { cause });
  } finally {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
  }

  if (!response.ok) {
    throw new WeatherServiceError(
      `Erro ao buscar previsão (HTTP ${response.status}).`,
    );
  }

  const data = (await response.json()) as ForecastResponse;

  return {
    city,
    current: mapCurrentWeather(data.current),
    forecast: mapForecastDays(data.daily),
  };
}
