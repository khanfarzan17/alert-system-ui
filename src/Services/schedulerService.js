import { API_BASE_URL } from "./config";

const SCHEDULER_URL = `${API_BASE_URL}/api/scheduler`;

function authHeaders(token) {
  const headers = { "Content-Type": "application/json" };
  if (token && token !== "logged-in") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * POST /api/scheduler
 * Sets the auto-alert schedule time.
 * Body: { time: "HH:mm", timezone: "Asia/Karachi", enabled: true }
 */
export async function setScheduler(payload, token) {
  const response = await fetch(SCHEDULER_URL, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Failed to save schedule");
  }

  return data;
}

/**
 * GET /api/scheduler
 * Returns the current schedule config.
 */
export async function getScheduler(token) {
  const response = await fetch(SCHEDULER_URL, {
    method: "GET",
    headers: authHeaders(token),
  });

  if (!response.ok) return null;

  try {
    return await response.json();
  } catch {
    return null;
  }
}
