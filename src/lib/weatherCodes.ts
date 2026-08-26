// Mapeamento dos códigos WMO (weather_code) da API Open-Meteo para rótulo pt-BR e ícone.

export interface WeatherCodeInfo {
  label: string;
  icon: string;
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'Céu limpo', icon: '☀️' },
  1: { label: 'Predominantemente limpo', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Névoa', icon: '🌫️' },
  48: { label: 'Névoa com geada', icon: '🌫️' },
  51: { label: 'Garoa fraca', icon: '🌦️' },
  53: { label: 'Garoa moderada', icon: '🌦️' },
  55: { label: 'Garoa intensa', icon: '🌦️' },
  61: { label: 'Chuva fraca', icon: '🌧️' },
  63: { label: 'Chuva moderada', icon: '🌧️' },
  65: { label: 'Chuva intensa', icon: '🌧️' },
  71: { label: 'Neve fraca', icon: '🌨️' },
  73: { label: 'Neve moderada', icon: '🌨️' },
  75: { label: 'Neve intensa', icon: '❄️' },
  80: { label: 'Pancadas de chuva fracas', icon: '🌦️' },
  81: { label: 'Pancadas de chuva moderadas', icon: '🌧️' },
  82: { label: 'Pancadas de chuva violentas', icon: '⛈️' },
  95: { label: 'Trovoada', icon: '⛈️' },
  96: { label: 'Trovoada com granizo fraco', icon: '⛈️' },
  99: { label: 'Trovoada com granizo forte', icon: '⛈️' },
};

const UNKNOWN_WEATHER_CODE_INFO: WeatherCodeInfo = {
  label: 'Condição desconhecida',
  icon: '❓',
};

export function getWeatherCodeInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODE_MAP[code] ?? UNKNOWN_WEATHER_CODE_INFO;
}
