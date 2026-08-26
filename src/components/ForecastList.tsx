import type { ForecastDay, Unit } from '../types/weather';
import ForecastCard from './ForecastCard';

interface ForecastListProps {
  days: ForecastDay[];
  unit: Unit;
}

export default function ForecastList(props: ForecastListProps) {
  const { days, unit } = props;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {days.map((day) => (
        <ForecastCard key={day.date} day={day} unit={unit} />
      ))}
    </div>
  );
}
