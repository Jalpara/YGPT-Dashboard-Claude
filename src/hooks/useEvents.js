import { useState, useEffect, useCallback } from "react";
import { APPS_SCRIPT_URL } from "../config.js";
import { EVENTS as STATIC_EVENTS } from "../data/events.js";
import { fetchEvents } from "../services/sheets.js";

/**
 * Returns { events, loading, error, refetch }.
 *
 * - If VITE_APPS_SCRIPT_URL is set, fetches live data from Google Sheets
 *   via the Apps Script web app and re-fetches every 60 seconds.
 * - Otherwise falls back to the static mock data in data/events.js.
 */
export function useEvents() {
  const [events, setEvents] = useState(STATIC_EVENTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!APPS_SCRIPT_URL) return; // use static data
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEvents();
      setEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    if (!APPS_SCRIPT_URL) return;
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [load]);

  return { events, loading, error, refetch: load };
}
