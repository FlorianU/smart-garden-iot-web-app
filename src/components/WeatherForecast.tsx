import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Cloud, CloudRain, CloudSnow, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const LATITUDE = 59.33;
const LONGITUDE = 18.06;
const API_KEY = "162b37bbaff304254b1a94f21af723b0";

const WeatherForecast = () => {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();

        // Map API data to the required format
        const hourlyData = data.list.map((entry) => {
          const date = new Date(entry.dt * 1000);
          return {
            hour: date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            }),
            temp: Math.round(entry.main.temp),
            precipitation: Math.round((entry.pop || 0) * 100), // Probability of precipitation
            icon:
              entry.weather[0].main === "Rain"
                ? CloudRain
                : entry.weather[0].main === "Snow"
                ? CloudSnow
                : entry.weather[0].main === "Clouds"
                ? Cloud
                : Sun,
          };
        });

        setForecast(hourlyData);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md">
      <div className="flex w-max space-x-4 p-4">
        {forecast.map((hour, i) => {
          const Icon = hour.icon;
          return (
            <div
              key={i}
              className="flex flex-col items-center space-y-2 text-center"
            >
              <span className="text-sm text-gray-500">{hour.hour}</span>
              <Icon className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium">{hour.temp}°C</span>
              <span className="text-xs text-gray-500">
                {hour.precipitation}%
              </span>
            </div>
          );
        })}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};

export default WeatherForecast;
