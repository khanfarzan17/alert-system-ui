import { SEND_ALERTS_URL } from "./api";

export async function sendAlerts(tableData, tableColumns) {
  const alertRows = tableData.filter(
    (row) => row["Days Remaining"] !== "N/A" && row["Days Remaining"] <= 50,
  );

  if (alertRows.length === 0) {
    return { status: "warning", title: "No Alerts Needed", message: "All assets are within safe limits." };
  }

  // Find column keys dynamically (case/space insensitive)
  const keys = Object.keys(tableData[0]);
  const ownerKey = keys.find((k) =>
    k.toLowerCase().replace(/\s/g, "").includes("owner"),
  );
  const riskEngineerKey = keys.find((k) =>
    k.toLowerCase().replace(/\s/g, "").includes("riskengineer"),
  );

  const alertPayload = alertRows.map((item) => ({
    assetName: item[tableColumns[0]?.id] || "Unknown",
    daysRemaining: item["Days Remaining"],
    owner: ownerKey ? item[ownerKey] : "N/A",
    riskEngineer: riskEngineerKey ? item[riskEngineerKey] : "N/A",
  }));

  try {
    const res = await fetch(SEND_ALERTS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
