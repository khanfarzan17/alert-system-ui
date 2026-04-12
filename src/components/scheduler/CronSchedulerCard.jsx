import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { getScheduler } from "../../Services/schedulerService";
import { buildCron, buildPreview, to12 } from "../../utils/schedulerHelpers";
import { DOW_MAP } from "../../utils/schedulerConstants";
import dayjs from "dayjs";

const deriveType = (data) => {
  if (data.intervalDays && data.intervalDays > 1) return "custom";
  if (data.dayOfMonth && data.dayOfMonth !== "*" && data.month === "*")
    return "monthly";
  if (data.dayOfWeek && data.dayOfWeek !== "*") return "weekly";
  return "daily";
};

const CronSchedulerCard = () => {
  const { token } = useAuth();
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    if (!token) return;
    getScheduler(token).then((data) => {
      if (data) {
        const type = deriveType(data);
        setSchedule({ ...data, type });
      }
    });
  }, [token]);

  const getNextRun = () => {
    if (!schedule) return null;
    const now = dayjs();
    let next = now
      .set("hour", schedule.hour)
      .set("minute", schedule.minute)
      .set("second", 0);

    switch (schedule.type) {
      case "weekly": {
        const targetDow = DOW_MAP[schedule.dayOfWeek];
        const currentDow = now.day();
        let diff = targetDow - currentDow;
        if (diff < 0 || (diff === 0 && now.isAfter(next))) diff += 7;
        next = next.add(diff, "day");
        break;
      }
      case "monthly":
        next = next.date(schedule.dayOfMonth);
        if (now.isAfter(next)) next = next.add(1, "month");
        break;
      case "custom":
        if (now.isAfter(next)) next = next.add(schedule.intervalDays, "day");
        break;
      default:
        if (now.isAfter(next)) next = next.add(1, "day");
    }
    return next;
  };

  const nextRun = schedule ? getNextRun() : null;

  const cronLabel =
    schedule?.type === "weekly"
      ? "Weekly Alert Cron"
      : schedule?.type === "monthly"
        ? "Monthly Alert Cron"
        : schedule?.type === "custom"
          ? "Custom Alert Cron"
          : "Daily Alert Cron";

  const cronExpr = schedule
    ? buildCron(
        schedule.type,
        schedule.hour,
        schedule.minute,
        schedule.dayOfWeek,
        schedule.dayOfMonth,
        schedule.intervalDays,
      )
    : null;

  const cronDetail = schedule
    ? `${cronExpr} · ${buildPreview(
        schedule.type,
        schedule.hour,
        schedule.minute,
        schedule.dayOfWeek,
        schedule.dayOfMonth,
        schedule.intervalDays,
      ).replace("Runs ", "")}`
    : null;

  return (
    <div className="dash-cron">
      <div className="dash-cron-head">
        <h3>Cron Scheduler</h3>
        {schedule ? (
          <span className="badge-active">
            <span className="dot"></span> Active
          </span>
        ) : (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text3)",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              padding: "3px 10px",
              borderRadius: "20px",
              letterSpacing: "0.2px",
            }}
          >
            Inactive
          </span>
        )}
      </div>

      {schedule ? (
        <div className="cron-card">
          <div className="cron-card-title">
            <span className="dot"></span>
            {cronLabel}
          </div>
          <div className="cron-card-detail">
            <span>{cronDetail}</span>
            {nextRun && (
              <span className="cron-next">{nextRun.format("ddd DD MMM")}</span>
            )}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--text3)",
              marginTop: 8,
              fontFamily: "'SF Mono', 'Consolas', monospace",
              background: "var(--surface2)",
              border: "1px solid var(--border)",
              padding: "3px 10px",
              borderRadius: "20px",
              display: "inline-block",
              letterSpacing: "0.5px",
            }}
          >
            {to12(schedule.hour, schedule.minute)}
          </div>
        </div>
      ) : (
        <div
          style={{
            fontSize: 12.5,
            color: "var(--text3)",
            textAlign: "center",
            padding: "18px 0",
          }}
        >
          No schedule configured yet
        </div>
      )}
    </div>
  );
};

export default CronSchedulerCard;
