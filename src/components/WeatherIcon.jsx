import { Cloud, CloudRain, CloudSun, Snowflake, Sun, Zap } from "lucide-react";

export default function WeatherIcon({ code, size = 34 }) {
  if ([0].includes(code)) return <Sun size={size} className="text-yellow-500" />;
  if ([1, 2].includes(code)) return <CloudSun size={size} className="text-yellow-500" />;
  if ([3, 45, 48].includes(code)) return <Cloud size={size} className="text-[#3F826D]" />;
  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code))
    return <CloudRain size={size} className="text-blue-500" />;
  if ([71, 73, 75, 77, 85, 86].includes(code))
    return <Snowflake size={size} className="text-cyan-500" />;
  if ([95, 96, 99].includes(code)) return <Zap size={size} className="text-orange-500" />;

  return <Sun size={size} className="text-yellow-500" />;
}