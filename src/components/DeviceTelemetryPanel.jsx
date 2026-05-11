import { Droplets, Sun, Thermometer, ThermometerSun, Waves, Sprout } from "lucide-react";

function formatNumber(value, decimals = 2) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "—";
  return number.toFixed(decimals);
}

function moistureIcon(value) {
  if (value >= 60) return <Waves size={22} className="text-blue-500" />;
  if (value >= 30) return <Droplets size={22} className="text-[#3F826D]" />;
  return <Sprout size={22} className="text-[#EF2356]" />;
}

function lightIcon(value) {
  if (value >= 500) return <Sun size={22} className="text-yellow-500" />;
  if (value >= 100) return <Sun size={22} className="text-orange-400" />;
  return <Sun size={22} className="text-[#C7C6BC]" />;
}

function ValueWithUnit({ value, unit }) {
  return (
    <p className="mt-2 flex items-start text-3xl font-extrabold">
      <span>{value}</span>
      {unit && (
        <span className="ml-1 mt-2 text-lg font-bold opacity-70">
          {unit}
        </span>
      )}
    </p>
  );
}

export default function DeviceTelemetryPanel({ telemetry }) {
  const roomTemp = formatNumber(telemetry?.temperatureC);
  const soilMoisture = formatNumber(telemetry?.soilMoisturePercent, 0);
  const lightLux = formatNumber(telemetry?.lightLux);
  const soilTemp = formatNumber(telemetry?.roomTempC);

  const cards = [
    {
      label: "Room Temperature",
      value: roomTemp,
      unit: "°C",
      icon: <Thermometer size={22} className="text-[#3F826D]" />
    },
    {
      label: "Soil Moisture",
      value: soilMoisture,
      unit: "%",
      icon: moistureIcon(Number(telemetry?.soilMoisturePercent))
    },
    {
      label: "Light Sensor",
      value: lightLux,
      unit: "Light level",
      icon: lightIcon(Number(telemetry?.lightLux))
    },
    {
      label: "Soil Temperature",
      value: soilTemp,
      unit: "°C",
      icon: <ThermometerSun size={22} className="text-orange-500" />
    }
  ];

  return (
    <div className="rounded-[32px] bg-white p-6 shadow-sm dark:bg-white/10">
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-[26px] bg-[#F9F7F3] p-5 dark:bg-black/20"
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-2xl bg-white p-3 shadow-sm dark:bg-white/10">
                {card.icon}
              </div>

              <p className="text-sm font-bold opacity-70">{card.label}</p>
            </div>

            <ValueWithUnit value={card.value} unit={card.value === "—" ? "" : card.unit} />
          </div>
        ))}
      </div>
    </div>
  );
}