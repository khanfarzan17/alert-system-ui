import { DOW_MAP } from "./schedulerConstants";

export const pad = (n) => String(n).padStart(2, "0");

export const to12 = (h, m) => {
  const ampm = h < 12 ? "AM" : "PM";
  return `${h % 12 || 12}:${pad(m)} ${ampm}`;
};

export const buildCron = (type, h, m, dow, dom, interval) => {
  switch (type) {
    case "daily":
      return `${pad(m)} ${h} * * *`;
    case "weekly":
      return `${pad(m)} ${h} * * ${DOW_MAP[dow]}`;
    case "monthly":
      return `${pad(m)} ${h} ${dom} * *`;
    case "custom":
      return `${pad(m)} ${h} */${interval} * *`;
    default:
      return `${pad(m)} ${h} * * *`;
  }
};

export const buildPreview = (type, h, m, dow, dom, interval) => {
  const t = to12(h, m);
  switch (type) {
    case "daily":
      return `Runs every day at ${t}`;
    case "weekly":
      return `Runs every ${dow} at ${t}`;
    case "monthly":
      return `Runs on day ${dom} of every month at ${t}`;
    case "custom":
      return `Runs every ${interval} days at ${t}`;
    default:
      return `Runs every day at ${t}`;
  }
};
