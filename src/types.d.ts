export interface LocationData {
  region: string,
  country: string
}

export interface RealtimeData {
  condition: string;
  icon: string;
  temp_c: number;
  temp_f: number;
  feelslike_c: number;
  feelslike_f: number;
  humidity: number;
  cloudCover: number;
  precip: number;
  wind_mph: number;
  wind_kph: number;
  wind_dir: string;
  vis_m: number;
  vis_km: number;
  uv: number;
  last_updated: string;
}

export interface ForecastData {
  date: string;
  condition: string;
  icon: string;
  maxtemp_c: number;
  maxtemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_kph: number;
  maxwind_mph: number;
  precip: number;
  snow: number;
  humidity: number;
  vis_km: number;
  vis_m: number;
  rain_chance: number;
  snow_chance: number;
  uv: number;
}
