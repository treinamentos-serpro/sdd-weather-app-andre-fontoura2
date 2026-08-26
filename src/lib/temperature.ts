import type { Unit } from '../types/weather';

export function toFahrenheit(celsius: number): number {
  return (celsius * 9) / 5 + 32;
}

export function formatTemperature(value: number, unit: Unit): string {
  if (unit === 'fahrenheit') {
    return `${Math.round(toFahrenheit(value))}°F`;
  }

  return `${Math.round(value)}°C`;
}
