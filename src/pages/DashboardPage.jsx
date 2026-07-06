import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Plus, X, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import AppShell from "../components/AppShell";
import PairDeviceForm from "../components/PairDeviceForm";
import DeviceCard from "../components/DeviceCard";
import WeatherIcon from "../components/WeatherIcon";
import { fetchDevicesThunk, pairDeviceThunk } from "../features/devices/deviceThunks";
import { fetchCommandsThunk } from "../features/commands/commandThunks";
import { getWeatherForecast } from "../utils/weather";

const DEVICE_IMG =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1783240179/Gemini_Generated_Image_1_tmoq5i.png"
export default function DashboardPage() {
  const dispatch = useDispatch();
  const { list, pairing, loadingList, error } = useSelector((state) => state.devices);

  const [pairOpen, setPairOpen] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [waterCommands, setWaterCommands] = useState([]);

  useEffect(() => {
    dispatch(fetchDevicesThunk());
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;

    async function loadWeather() {
      try {
        setWeatherLoading(true);
        const data = await getWeatherForecast();
        if (mounted) setWeatherData(data);
      } catch (err) {
        if (mounted) setWeatherError(err.message || "Could not load weather.");
      } finally {
        if (mounted) setWeatherLoading(false);
      }
    }

    loadWeather();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadWaterCommands() {
      if (!list?.length) {
        setWaterCommands([]);
        return;
      }

      try {
        const results = await Promise.allSettled(
          list.map((device) => dispatch(fetchCommandsThunk(device._id)).unwrap())
        );

        const allCommands = results
          .filter((result) => result.status === "fulfilled")
          .flatMap((result) => result.value || [])
          .filter((command) => command.type === "water_plant");

        if (mounted) setWaterCommands(allCommands);
      } catch {
        if (mounted) setWaterCommands([]);
      }
    }

    loadWaterCommands();

    return () => {
      mounted = false;
    };
  }, [dispatch, list]);

  async function handlePairDevice(payload) {
    await dispatch(pairDeviceThunk(payload));
    dispatch(fetchDevicesThunk());
    setPairOpen(false);
  }

  const topDevices = useMemo(() => list.slice(0, 2), [list]);
  const latestDevice = list?.[0];

  const waterStats = useMemo(() => {
    const days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));

      return {
        key: date.toDateString(),
        label: date.toLocaleDateString([], { weekday: "short" }),
        count: 0
      };
    });

    waterCommands.forEach((command) => {
      const key = new Date(command.createdAt).toDateString();
      const match = days.find((day) => day.key === key);
      if (match) match.count += 1;
    });

    return days;
  }, [waterCommands]);

  const maxWaterCount = Math.max(...waterStats.map((day) => day.count), 1);

  function formatTelemetryValue(value, decimals = 2) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  return number.toFixed(decimals);
}

  return (
    <AppShell>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.8fr]">
        <section className="rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-bold text-[#3F826D]">Devices</p>
              <h1 className="text-3xl font-extrabold">Monitor your garden</h1>
            </div>

            <button
              onClick={() => setPairOpen(true)}
              className="flex items-center gap-2 rounded-[10mm] bg-[#3F826D] px-5 py-3 font-bold text-[#F9F7F3] hover:bg-[#356f5d]"
            >
              <Plus size={17} />
              Pair
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-[24px] bg-[#EF2356]/10 p-4 text-sm text-[#EF2356]">
              {error}
            </div>
          )}

          {loadingList ? (
            <div className="rounded-[28px] bg-[#F9F7F3] p-8 text-center opacity-60 dark:bg-black/20">
              Loading devices...
            </div>
          ) : list.length === 0 ? (
            <div className="rounded-[28px] bg-[#F9F7F3] p-8 text-center opacity-60 dark:bg-black/20">
              No paired devices yet.
            </div>
          ) : (
            <Link to="/devices" className="block rounded-[32px]">
              <div className="grid gap-4 md:grid-cols-2">
                {topDevices.map((device) => (
                  <DeviceCard key={device._id} device={device} />
                ))}
              </div>

              <div className="mt-5 flex items-center justify-end gap-2 text-sm font-bold text-[#3F826D]">
                View all devices <ArrowRight size={16} />
              </div>
            </Link>
          )}
        </section>

        <section className="flex min-h-[420px] flex-col rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
          {weatherLoading ? (
            <div className="flex h-full min-h-64 items-center justify-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#C7C6BC] border-t-[#3F826D]" />
            </div>
          ) : weatherError ? (
            <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
              <AlertTriangle className="text-[#EF2356]" size={42} />
              <h2 className="mt-4 text-xl font-bold">Weather is unavailable</h2>
              <p className="mt-2 max-w-sm text-sm opacity-60">
                I could not load the forecast right now. Try refreshing the page in a moment.
              </p>
            </div>
          ) : (
<>
  <div className="mb-6 flex items-start justify-between">
    <div className="mt-1">
      <p className="text-sm font-bold text-[#3F826D]">Today</p>
      <h2 className="text-2xl font-extrabold">Forecast</h2>

      <p className="mt-1 text-sm opacity-60">
        {weatherData.location.state}, {weatherData.location.town}
      </p>
    </div>

    <WeatherIcon code={weatherData.weather.current.weather_code} size={92} />
  </div>

  <div className="flex flex-1 flex-col">
    <div className="flex flex-1 flex-col items-center justify-center text-center">
      <p className="text-8xl font-extrabold">
        {Math.round(weatherData.weather.current.temperature_2m)}°
      </p>

      <p className="mt-2 opacity-60 font-bold">
        Humidity {weatherData.weather.current.relative_humidity_2m}%
      </p>
    </div>

    <div className="flex justify-center pt-8">
      <Link
        to="/forecast"
        className="inline-flex items-center gap-2 rounded-[10mm] bg-[#3F826D] px-5 py-3 font-bold text-[#F9F7F3] transition hover:scale-[1.02] hover:bg-[#356f5d]"
      >
        See forecast <ArrowRight size={16} />
      </Link>
    </div>
  </div>
</>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <section className="rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
          <div>
            <p className="text-sm font-bold text-[#3F826D]">Watering</p>
            <h2 className="text-2xl font-extrabold">Last 7 days</h2>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3">
            {waterStats.map((day) => (
              <div key={day.key} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex h-44 w-full items-end rounded-2xl bg-[#F9F7F3] p-1 dark:bg-black/20">
                  <div
                    className="w-full rounded-xl bg-[#3F826D] transition-all"
                    style={{
                      height: `${Math.max(10, (day.count / maxWaterCount) * 160)}px`
                    }}
                    title={`${day.count} watering commands`}
                  />
                </div>

                <p className="text-xs font-bold opacity-60">{day.label}</p>
                <p className="text-xs opacity-40">{day.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] bg-white p-6 shadow-sm dark:bg-white/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-[#3F826D]">Latest telemetry</p>
              <h2 className="text-2xl font-extrabold">{latestDevice?.name || "No device yet"}</h2>
            </div>

            {latestDevice && (
              <Link
                to={`/devices/${latestDevice._id}`}
                className="rounded-full bg-[#3F826D] p-3 text-white transition hover:scale-[1.05] hover:bg-[#356f5d]"
              >
                <ArrowRight size={18} />
              </Link>
            )}
          </div>

          <div className="mt-6 flex justify-center">
            <img src={DEVICE_IMG} alt="Device" className="h-40 object-contain" />
          </div>

<div className="mt-6 grid gap-3 sm:grid-cols-3">
  {[
    ["temperatureC", "Room Temperature"],
    ["soilMoisturePercent", "Soil Moisture"],
    ["lightLux", "Light Sensor"]
  ].map(([key, label]) => (
    <div
      key={key}
      className="flex min-h-[120px] flex-col justify-around rounded-[24px] bg-[#F9F7F3] p-4 dark:bg-black/20"
    >
      <p className="text-xs font-bold uppercase opacity-50">{label}</p>

      <div className="">
        <p className="text-3xl font-extrabold">
          {formatTelemetryValue(
  latestDevice?.latestData?.[key],
  key === "soilMoisturePercent" ? 0 : 2
)}
        </p>
      </div>
    </div>
  ))}
</div>
        </section>
      </div>

      {pairOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 px-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg">
            <button
              onClick={() => setPairOpen(false)}
              className="absolute -right-3 -top-3 z-10 rounded-full bg-[#EF2356] p-2 text-white hover:bg-[#d91f4d]"
            >
              <X size={18} />
            </button>

            <PairDeviceForm loading={pairing} onSubmit={handlePairDevice} />
          </div>
        </div>
      )}
    </AppShell>
  );
}