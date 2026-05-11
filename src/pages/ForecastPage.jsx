import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import AppShell from "../components/AppShell";
import WeatherIcon from "../components/WeatherIcon";
import { getWeatherForecast } from "../utils/weather";

export default function ForecastPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [weatherError, setWeatherError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const result = await getWeatherForecast();
        if (mounted) setData(result);
      } catch (err) {
        if (mounted) setWeatherError(err.message || "Could not load forecast.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const days =
    data?.weather?.daily?.time?.map((time, i) => ({
      time,
      code: data.weather.daily.weather_code[i],
      max: data.weather.daily.temperature_2m_max[i],
      min: data.weather.daily.temperature_2m_min[i],
      rain: data.weather.daily.precipitation_probability_max[i]
    })) || [];

  return (
    <AppShell>
      <section className="rounded-[36px] bg-white p-8 shadow-sm dark:bg-white/10">
        {loading ? (
          <div className="flex min-h-96 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C7C6BC] border-t-[#3F826D]" />
          </div>
        ) : weatherError ? (
          <div className="flex min-h-96 flex-col items-center justify-center text-center">
            <AlertTriangle className="text-[#EF2356]" size={52} />
            <h2 className="mt-5 text-2xl font-extrabold">Could not load forecast</h2>
            <p className="mt-2 max-w-md opacity-60">
              The weather service did not respond. I will default to Tel Aviv when possible, but right now the request failed.
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div>
                <p className="text-4xl font-bold text-[#3F826D]">
                  {data.location.state}, {data.location.town}
                </p>

                <p className="mt-2 text-sm opacity-60">
                  {new Date().toLocaleDateString([], {
                    weekday: "long",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>

                <div className="mt-6 flex items-center gap-4">
                  <WeatherIcon code={data.weather.current.weather_code} size={58} />
                  <p className="text-7xl font-extrabold">
                    {Math.round(data.weather.current.temperature_2m)}°
                  </p>
                </div>
              </div>

              <div className="text-right text-sm opacity-70">
                <p>Humidity: {data.weather.current.relative_humidity_2m}%</p>
                <p>Precipitation: {data.weather.current.precipitation}%</p>
                <p>Wind: {data.weather.current.wind_speed_10m} km/h</p>
              </div>
            </div>

            {/* <div className="mt-10 h-2 rounded-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 to-[#EF2356]" /> */}

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-7">
              {days.slice(0, 7).map((day) => (
                <div
                  key={day.time}
                  className="rounded-[28px] border border-black/5 bg-[#F9F7F3] p-5 text-center shadow-sm dark:border-white/10 dark:bg-black/20"
                >
                  <p className="font-bold">
                    {new Date(day.time).toLocaleDateString([], { weekday: "short" })}
                  </p>

                  <div className="my-5 flex justify-center">
                    <WeatherIcon code={day.code} />
                  </div>

                  <p className="font-extrabold">
                    {Math.round(day.max)}°{" "}
                    <span className="text-sm font-normal opacity-50">{Math.round(day.min)}°</span>
                  </p>

                  <p className="mt-2 text-xs opacity-50">{day.rain}% rain</p>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}