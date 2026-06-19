import { useEffect, useState } from "react";

import { auth, db, ref, onValue } from "../services/firebase";

import {
  mergeReadings,
  normalizeReadings,
} from "../utils/waterReadings";

const LIVE_PATH = "waterQuality/latest";
const LIVE_DEBOUNCE_MS = 400;

export default function useSensorData(isGuest, userId) {
  const [data, setData] = useState([]);
  const [liveReading, setLiveReading] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const historyPaths = ["water_data"];

    if (isGuest) {
      historyPaths.push("guest_data");
    } else if (userId) {
      historyPaths.push(`users/${userId}/water_data`);
    }

    let liveDebounceTimer = null;
    let pendingLiveVal = null;
    let historyByPath = historyPaths.map(() => []);
    let liveList = [];
    let mounted = true;

    const publish = () => {
      if (!mounted) return;
      const historyList = mergeReadings([], ...historyByPath);
      const merged = mergeReadings(liveList, historyList);
      setLiveReading(liveList[0] ?? null);
      setData(merged);
      setLoading(false);
    };

    const applyLiveVal = (val) => {
      liveList = normalizeReadings(val, { isLive: true });
      publish();
    };

    const scheduleLiveUpdate = (val) => {
      pendingLiveVal = val;
      if (liveDebounceTimer) clearTimeout(liveDebounceTimer);
      liveDebounceTimer = setTimeout(() => {
        applyLiveVal(pendingLiveVal);
        pendingLiveVal = null;
      }, LIVE_DEBOUNCE_MS);
    };

    const unsubLive = onValue(
      ref(db, LIVE_PATH),
      (snapshot) => {
        setError(null);
        scheduleLiveUpdate(snapshot.val());
      },
      (err) => {
        console.warn(`Firebase read failed for ${LIVE_PATH}:`, err.message);
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    );

    const unsubHistory = historyPaths.map((path, index) =>
      onValue(
        ref(db, path),
        (snapshot) => {
          historyByPath[index] = normalizeReadings(snapshot.val());
          publish();
        },
        (err) => {
          console.warn(`Firebase read failed for ${path}:`, err.message);
        }
      )
    );

    return () => {
      mounted = false;
      if (liveDebounceTimer) clearTimeout(liveDebounceTimer);
      unsubLive();
      unsubHistory.forEach((unsub) => unsub());
    };
  }, [isGuest, userId]);

  return { data, liveReading, error, loading };
}
