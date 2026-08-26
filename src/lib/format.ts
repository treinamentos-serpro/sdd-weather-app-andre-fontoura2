const WEEKDAY_ABBREVIATIONS: Record<number, string> = {
  0: 'Dom',
  1: 'Seg',
  2: 'Ter',
  3: 'Qua',
  4: 'Qui',
  5: 'Sex',
  6: 'Sáb',
};

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function parseIsoDate(dateIso: string): Date {
  const [year, month, day] = dateIso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Formata uma data ISO ("YYYY-MM-DD") como rótulo de dia para a previsão de 5 dias:
 * "Hoje", "Amanhã" ou o nome abreviado do dia da semana em pt-BR.
 */
export function formatDayLabel(dateIso: string, referenceDate: Date = new Date()): string {
  const target = startOfDay(parseIsoDate(dateIso));
  const reference = startOfDay(referenceDate);

  const diffDays = Math.round((target.getTime() - reference.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return 'Hoje';
  }

  if (diffDays === 1) {
    return 'Amanhã';
  }

  return WEEKDAY_ABBREVIATIONS[target.getDay()];
}
