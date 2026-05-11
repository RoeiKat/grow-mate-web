import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { formatRelativeTime, isOnline } from "../utils/format";

const DEVICE_IMG =
  "https://res.cloudinary.com/dm20uwmki/image/upload/v1778489591/sprout-tree-svgrepo-com_pfwl8p.svg";

export default function DeviceCard({ device }) {
  const online = isOnline(device.lastSeenAt);

  return (
    <Link
      to={`/devices/${device._id}`}
      className="group block rounded-[32px] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-bold">{device.name || "Unnamed device"}</h3>

        <span
          className={`relative h-3.5 w-3.5 rounded-full ${
            online ? "bg-[#3F826D]" : "bg-[#EF2356]"
          }`}
        >
          <span
            className={`absolute inset-0 animate-ping rounded-full ${
              online ? "bg-[#3F826D]" : "bg-[#EF2356]"
            } opacity-40`}
          />
        </span>
      </div>

      <div className="my-6 flex justify-center">
        <div className="h-36 w-44 rounded-[28px] bg-[#F9F7F3] p-5 dark:bg-black/20">
          <img src={DEVICE_IMG} alt="Device" className="h-full w-full object-contain" />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <p className="opacity-70">Last seen at: {formatRelativeTime(device.lastSeenAt)}</p>
        <ChevronRight className="transition group-hover:translate-x-1" size={18} />
      </div>
    </Link>
  );
}