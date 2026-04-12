import { SEND_ALERTS_URL } from "./config";

export async function sendAlerts(tableData, tableColumns, token) {
  const alertRows = tableData.filter(
    (row) => row["Days Remaining"] !== "N/A" && row["Days Remaining"] <= 50,
  );

  if (alertRows.length === 0) {
    return {
      status: "warning",
      title: "No Alerts Needed",
      message: "All assets are within safe limits.",
    };
  }

  const colIds = tableColumns.map((c) => c.id);
  const find = (pattern) =>
    colIds.find((k) => k.toLowerCase().replace(/\s/g, "").includes(pattern)) ?? null;

  const assetNameKey    = find("assetname") ?? colIds[0] ?? null;
  const ownerKey        = find("owner");
  const riskEngineerKey = find("riskengineer");

  const alertPayload = alertRows.map((item) => ({
    assetName:    assetNameKey    ? item[assetNameKey]    : "Unknown",
    daysRemaining: item["Days Remaining"],
    owner:         ownerKey        ? item[ownerKey]        : "N/A",
    riskEngineer:  riskEngineerKey ? item[riskEngineerKey] : "N/A",
  }));

  const headers = { "Content-Type": "application/json" };
  if (token && token !== "logged-in") {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(SEND_ALERTS_URL, {
      method: "POST",
      headers,
      body: JSON.stringify(alertPayload),
    });

    if (!res.ok) throw new Error("Server responded with " + res.status);

    return {
      status: "success",
      title: "Alerts Sent!",
      message: `${alertRows.length} asset(s) have been notified successfully.`,
    };
  } catch (err) {
    console.error("Send alerts error:", err);
    return {
      status: "error",
      title: "Send Failed",
      message: "Could not reach the server. Make sure your backend is running.",
    };
  }
}
