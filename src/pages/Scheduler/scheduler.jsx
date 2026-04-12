import React, { useState, useMemo } from "react";
import { useAuth } from "../../components/context/Authcontext";
import { setScheduler } from "../../Services/schedulerService";
import { buildCron, buildPreview } from "../../utils/schedulerHelpers";
import ScheduleStatStrip from "../../components/scheduler/ScheduleStatStrip";
import ScheduleTypeTabs from "../../components/scheduler/ScheduleTypeTabs";
import TimeConfiguration from "../../components/scheduler/TimeConfiguration";
import LivePreview from "../../components/scheduler/LivePreview";
import ScheduleActionButtons from "../../components/scheduler/ScheduleActionButtons";

// ── Component ─────────────────────────────────────────────────────────────────

const Scheduler = () => {
  const { token } = useAuth();

  // Form state
  const [schedType, setSchedType] = useState("daily");
  const [hour, setHour] = useState(8);
  const [minute, setMinute] = useState(0);
  const [timezone, setTimezone] = useState("UTC");
  const [dayOfWeek, setDayOfWeek] = useState("Monday");
  const [dayOfMonth, setDayOfMonth] = useState(1);
  const [intervalDays, setIntervalDays] = useState(7);

  const [isSaving, setIsSaving] = useState(false);

  // Derived
  const cronExpr = useMemo(
    () =>
      buildCron(schedType, hour, minute, dayOfWeek, dayOfMonth, intervalDays),
    [schedType, hour, minute, dayOfWeek, dayOfMonth, intervalDays],
  );
  const previewText = useMemo(
    () =>
      buildPreview(
        schedType,
        hour,
        minute,
        dayOfWeek,
        dayOfMonth,
        intervalDays,
      ),
    [schedType, hour, minute, dayOfWeek, dayOfMonth, intervalDays],
  );
  const handleSave = async () => {
    setIsSaving(true);
    const payload = {
      type: schedType,
      hour,
      minute,
      timezone,
      dayOfWeek,
      dayOfMonth,
      intervalDays,
      cronExpression: cronExpr,
    };
    try {
      await setScheduler(payload, token);
    } catch (err) {
      console.error(err.message || "Could not save schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setSchedType("daily");
    setHour(8);
    setMinute(0);
    setTimezone("UTC");
    setDayOfWeek("Monday");
    setDayOfMonth(1);
    setIntervalDays(7);
  };

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Page Header */}
      <div className="ph">
        <div className="ph-title">Alert Scheduler</div>
        <div className="ph-sub">
          Configure automated alert dispatch rules — set time, recurrence, and
          timezone
        </div>
      </div>

      <ScheduleStatStrip
        schedType={schedType}
        hour={hour}
        minute={minute}
        timezone={timezone}
        dayOfWeek={dayOfWeek}
        dayOfMonth={dayOfMonth}
        intervalDays={intervalDays}
      />

      <ScheduleTypeTabs schedType={schedType} setSchedType={setSchedType} />

      <TimeConfiguration
        schedType={schedType}
        hour={hour}
        setHour={setHour}
        minute={minute}
        setMinute={setMinute}
        timezone={timezone}
        setTimezone={setTimezone}
        dayOfWeek={dayOfWeek}
        setDayOfWeek={setDayOfWeek}
        dayOfMonth={dayOfMonth}
        setDayOfMonth={setDayOfMonth}
        intervalDays={intervalDays}
        setIntervalDays={setIntervalDays}
      />

      <LivePreview
        previewText={previewText}
        cronExpr={cronExpr}
        timezone={timezone}
      />

      <ScheduleActionButtons
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
      />
    </div>
  );
};

export default Scheduler;
