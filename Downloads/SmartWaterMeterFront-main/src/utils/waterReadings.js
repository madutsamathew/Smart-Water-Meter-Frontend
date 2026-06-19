/** ESP32 and API field names → app display fields */
export function normalizeRecord(item) {
  if (!item || typeof item !== "object") return null;

  const ph = item.ph ?? item.pH;
  const turbidity =
    item.turbidity ?? item.turbidity_ntu ?? item.turbidityNTU;
  const temperature =
    item.temperature ?? item.temperature_c ?? item.temp ?? item.temperatureC;
  const tds = item.tds ?? item.tds_ppm ?? item.TDS;

  if (
    ph === undefined &&
    temperature === undefined &&
    turbidity === undefined &&
    tds === undefined
  ) {
    return null;
  }

  return {
    ph: Number(ph ?? 0),
    turbidity: Number(turbidity ?? 0),
    temperature: Number(temperature ?? 0),
    tds: Number(tds ?? 0),
    status: item.status ?? "Unknown",
    timestamp: parseTimestamp(item.timestamp),
    isLive: Boolean(item.isLive),
    receivedAt: Date.now(),
  };
}

function parseTimestamp(ts) {
  if (ts === undefined || ts === null) {
    return new Date().toISOString();
  }

  if (typeof ts === "number") {
    // Unix epoch in ms (API / JS)
    if (ts > 1e12) {
      return new Date(ts).toISOString();
    }
    // ESP millis() since boot — not a real clock; treat as "now" when received
    return new Date().toISOString();
  }

  const parsed = Date.parse(ts);
  if (!Number.isNaN(parsed)) {
    return new Date(parsed).toISOString();
  }

  return new Date().toISOString();
}

/**
 * Turn Firebase snapshot value into a sorted list of readings.
 * Supports push IDs ({ "-abc": { ph, ... } }) and a single object ({ ph, ... }).
 */
export function normalizeReadings(val, { isLive = false } = {}) {
  if (!val || typeof val !== "object") return [];

  const hasSensorField =
    val.ph !== undefined ||
    val.pH !== undefined ||
    val.turbidity !== undefined ||
    val.turbidity_ntu !== undefined ||
    val.temperature !== undefined ||
    val.temperature_c !== undefined ||
    val.tds !== undefined ||
    val.tds_ppm !== undefined;

  if (hasSensorField) {
    const one = normalizeRecord({ ...val, isLive });
    return one ? [one] : [];
  }

  return Object.values(val)
    .map((item) => normalizeRecord(item))
    .filter(Boolean)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

export function mergeReadings(liveList, ...historyLists) {
  const history = new Map();

  for (const list of historyLists) {
    if (!Array.isArray(list)) continue;
    for (const item of list) {
      const key = `${item.timestamp}-${item.ph}-${item.tds}`;
      history.set(key, item);
    }
  }

  const live = liveList[0];
  const sortedHistory = Array.from(history.values()).sort(
    (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
  );

  if (live) {
    return [live, ...sortedHistory].slice(0, 20);
  }

  return sortedHistory.slice(0, 20);
}
