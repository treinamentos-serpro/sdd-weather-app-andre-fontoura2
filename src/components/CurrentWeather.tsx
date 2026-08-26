import type React from 'react';
import type { City, CurrentWeather as CurrentWeatherData, Unit } from '../types/weather';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';

interface CurrentWeatherProps {
  city: City;
  current: CurrentWeatherData;
  unit: Unit;
}

interface MetricProps {
  label: string;
  value: number | undefined | null;
  suffix: string;
}

function formatMetricValue(value: number | undefined | null): string {
  return value === undefined || value === null ? '—' : `${value}`;
}

function Metric({ label, value, suffix }: MetricProps): React.JSX.Element {
  const displayValue = formatMetricValue(value);

  return (
    <div className="flex flex-col items-center gap-1 rounded-xl bg-white/10 p-3 text-center backdrop-blur-sm">
      <span className="text-xs uppercase tracking-wide text-white/70">{label}</span>
      <span className="text-lg font-semibold text-white">
        {displayValue === '—' ? displayValue : `${displayValue}${suffix}`}
      </span>
    </div>
  );
}

export default function CurrentWeather({ city, current, unit }: CurrentWeatherProps): React.JSX.Element {
  const { label, icon } = getWeatherCodeInfo(current.weatherCode);

  return (
    <section
      aria-label="Clima atual"
      className="rounded-2xl border border-white/20 bg-white/10 p-6 shadow-lg backdrop-blur-md"
    >
      <header className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-xl font-medium text-white/90">
          {city.name}, {city.country}
        </h2>
        <div className="flex items-center gap-3">
          <span className="text-5xl" aria-hidden="true">
            {icon}
          </span>
          <span className="text-6xl font-bold text-white">
            {formatTemperature(current.temperature, unit)}
          </span>
        </div>
        <p className="text-white/80">{label}</p>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Metric label="Umidade" value={current.humidity} suffix="%" />
        <Metric label="Vento" value={current.windSpeed} suffix=" km/h" />
        <Metric label="Pressão" value={current.pressure} suffix=" hPa" />
        <Metric label="Precipitação" value={current.precipitation} suffix=" mm" />
      </div>
    </section>
  );
}
