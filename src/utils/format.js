export function formatDate(value) {
  if (!value) return "—";
  return new Date(value).toLocaleString();
}

export function prettyJson(value) {
  try {
    return JSON.stringify(value ?? {}, null, 2);
  } catch {
    return "{}";
  }
}

export function getOnlineLabel(lastSeenAt) {
  if (!lastSeenAt) return "Unknown";

  const diff = Date.now() - new Date(lastSeenAt).getTime();
  if (diff < 60_000) return "Online";
  if (diff < 5 * 60_000) return "Recently seen";
  return "Offline";
}