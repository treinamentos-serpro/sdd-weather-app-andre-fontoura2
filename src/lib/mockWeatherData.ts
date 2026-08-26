import type { WeatherData } from '../types/weather';

function isoDateFromToday(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  return date.toISOString().slice(0, 10);
}

export const mockWeatherData: WeatherData = {
  city: {
    id: 3448439,
    name: 'São Paulo',
    country: 'Brasil',
    admin1: 'São Paulo',
    latitude: -23.5475,
    longitude: -46.6361,
  },
  current: {
    temperature: 22.4,
    weatherCode: 2,
    humidity: 68,
    windSpeed: 14.2,
    pressure: 1015,
    precipitation: 0,
    time: new Date().toISOString(),
  },
  forecast: [
    {
      date: isoDateFromToday(0),
      min: 17,
      max: 24,
      weatherCode: 2,
      precipitationProbability: 10,
    },
    {
      date: isoDateFromToday(1),
      min: 16,
      max: 23,
      weatherCode: 1,
      precipitationProbability: 5,
    },
    {
      date: isoDateFromToday(2),
      min: 18,
      max: 25,
      weatherCode: 0,
      precipitationProbability: 0,
    },
    {
      date: isoDateFromToday(3),
      min: 19,
      max: 22,
      weatherCode: 61,
      precipitationProbability: 70,
    },
    {
      date: isoDateFromToday(4),
      min: 17,
      max: 21,
      weatherCode: 95,
      precipitationProbability: 85,
    },
  ],
};
