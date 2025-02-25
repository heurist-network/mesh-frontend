import { tool } from 'ai';
import { z } from 'zod';

export const weatherParamsSchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const weatherDescription = 'Get the current weather at a location';

export type WeatherParams = z.infer<typeof weatherParamsSchema>;

export interface WeatherResult {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: {
    time: string;
    interval: string;
    temperature_2m: string;
  };
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
  };
  hourly_units: {
    time: string;
    temperature_2m: string;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
  };
  daily_units: {
    time: string;
    sunrise: string;
    sunset: string;
  };
  daily: {
    time: string[];
    sunrise: string[];
    sunset: string[];
  };
}

export const getWeather = () =>
  tool({
    description: weatherDescription,
    parameters: weatherParamsSchema,
    execute: async ({ latitude, longitude }: WeatherParams) => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&hourly=temperature_2m&daily=sunrise,sunset&timezone=auto`,
      );

      const weatherData = await response.json();
      return weatherData as WeatherResult;
    },
  });
