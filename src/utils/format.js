export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function formatRelativeTime(value) {
  if (!value) return "Never";

  const date = new Date(value);
  const now = new Date();

  const sameDay = date.toDateString() === now.toDateString();

  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (sameDay) return `Today ${time}`;
  if (date.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;

  const diffDays = Math.floor((now - date) / 86400000);
  if (diffDays <= 7) return `${diffDays} Days ago`;

  return date.toLocaleDateString();
}

export function getOnlineLabel(lastSeenAt) {
  if (!lastSeenAt) return "Offline";
  const diff = Date.now() - new Date(lastSeenAt).getTime();
  return diff < 60_000 ? "Online" : "Offline";
}

export function isOnline(lastSeenAt) {
  return getOnlineLabel(lastSeenAt) === "Online";
}