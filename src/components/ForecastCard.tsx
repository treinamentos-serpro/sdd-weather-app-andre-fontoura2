import type { ForecastDay, Unit } from '../types/weather';
import { formatTemperature } from '../lib/temperature';
import { getWeatherCodeInfo } from '../lib/weatherCodes';
import { formatDayLabel } from '../lib/format';

interface ForecastCardProps {
  day: ForecastDay;
  unit: Unit;
}

export default function ForecastCard(props: ForecastCardProps) {
  const { day, unit } = props;
  const { label, icon } = getWeatherCodeInfo(day.weatherCode);

  return (
    <div className="flex flex-col items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center text-white backdrop-blur-md">
      <span className="text-sm font-medium text-white/80">{formatDayLabel(day.date)}</span>
      <span className="text-3xl" aria-hidden="true">
        {icon}
      </span>
      <span className="text-xs text-white/70">{label}</span>
      <div className="flex items-baseline gap-2">
        <span className="text-lg font-semibold">{formatTemperature(day.max, unit)}</span>
        <span className="text-sm text-white/60">{formatTemperature(day.min, unit)}</span>
      </div>
      <span className="text-xs text-sky-300">{day.precipitationProbability}%</span>
    </div>
  );
}
