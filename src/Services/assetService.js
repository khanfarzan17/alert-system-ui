import { API_BASE_URL } from "./config";

const ASSETS_URL = `${API_BASE_URL}/api/assets`;

function authHeaders(token) {
  const headers = {};
  if (token && token !== "logged-in") {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * POST /api/assets
 * Sends { fileName, data } mapped to the exact backend schema:
 * assetId, assetName, itemNumber, owner, riskEngineer, createdDate, dueDate, daysRemaining
 */
export async function uploadAssetFile(tableData, tableColumns, fileName, token) {
  const colIds = tableColumns.map((c) => c.id);

  const find = (pattern) =>
    colIds.find((k) => k.toLowerCase().replace(/\s/g, "").includes(pattern)) ?? null;

  const assetIdKey      = find("assetid");
  const assetNameKey    = find("assetname") ?? colIds[0] ?? null;
  const itemNumberKey   = find("itemnumber") ?? find("itemno") ?? find("item#");
  const ownerKey        = find("owner");
  const riskEngineerKey = find("riskengineer");
  const createdDateKey  = find("createddate") ?? find("createdat");
  const dueDateKey      = find("duedate");

  const data = tableData.map((row) => ({
    assetId:       assetIdKey      ? row[assetIdKey]      : null,
    assetName:     assetNameKey    ? row[assetNameKey]    : "Unknown",
    itemNumber:    itemNumberKey   ? row[itemNumberKey]   : null,
    owner:         ownerKey        ? row[ownerKey]        : null,
    riskEngineer:  riskEngineerKey ? row[riskEngineerKey] : null,
    createdDate:   createdDateKey  ? row[createdDateKey]  : null,
    dueDate:       dueDateKey      ? row[dueDateKey]      : null,
    daysRemaining: row["Days Remaining"] !== "N/A" ? Number(row["Days Remaining"]) : null,
  }));

  const response = await fetch(ASSETS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
    body: JSON.stringify({ fileName, data }),
  });

  let resData = {};
  try {
    resData = await response.json();
  } catch {
    resData = {};
  }

  if (!response.ok) {
    throw new Error(resData?.message || resData?.error || "Failed to upload file");
  }

  return resData;
}

/**
 * GET /api/assets
 * Returns distinct upload history entries derived from { fileName, uploadedAt } on asset documents.
 */
export async function fetchUploadHistory(token) {
  const response = await fetch(ASSETS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(token),
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch upload history");
  }

  const res = await response.json();
  const raw = Array.isArray(res) ? res : res?.data ?? [];

  // Derive distinct upload entries from fileName + uploadedAt on asset documents
  const seen = new Map();
  for (const item of raw) {
    const name = item.fileName ?? null;
    if (!name || seen.has(name)) continue;
    seen.set(name, {
      name,
      uploadedAt: item.uploadedAt
        ? new Date(item.uploadedAt).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "",
    });
  }

  // Most recent first
  return Array.from(seen.values()).reverse();
}

