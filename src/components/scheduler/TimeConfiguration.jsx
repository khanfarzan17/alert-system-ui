import React from "react";
import { TIMEZONES, DOW_MAP } from "../../utils/schedulerConstants";
import { pad } from "../../utils/schedulerHelpers";
import { card, selectStyle } from "../../utils/schedulerStyles";

const TimeConfiguration = ({
  schedType,
  hour,
  setHour,
  minute,
  setMinute,
  timezone,
  setTimezone,
  dayOfWeek,
  setDayOfWeek,
  dayOfMonth,
  setDayOfMonth,
  intervalDays,
  setIntervalDays,
}) => {
  return (
    <div style={card}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            background: "rgba(75,123,245,0.14)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          🕐
        </div>
        <div>
          <div
            style={{ fontSize: 12.5, fontWeight: 700, color: "var(--text1)" }}
          >
            Time configuration
          </div>
          <div style={{ fontSize: 10.5, color: "var(--text3)", marginTop: 1 }}>
            Set the exact time and timezone for dispatch
          </div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text2)",
              marginBottom: 5,
            }}
          >
            Hour (0–23)
          </div>
          <select
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            style={selectStyle}
          >
            {Array.from({ length: 24 }, (_, i) => (
              <option key={i} value={i}>
                {pad(i)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text2)",
              marginBottom: 5,
            }}
          >
            Minute (0–59)
          </div>
          <select
            value={minute}
            onChange={(e) => setMinute(Number(e.target.value))}
            style={selectStyle}
          >
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55].map((m) => (
              <option key={m} value={m}>
                {pad(m)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "var(--text2)",
              marginBottom: 5,
            }}
          >
            Timezone
          </div>
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            style={selectStyle}
          >
            {TIMEZONES.map(({ label, value }) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>

      {schedType === "weekly" && (
        <>
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "14px 0",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text2)",
                marginBottom: 5,
              }}
            >
              Day of week
            </div>
            <select
              value={dayOfWeek}
              onChange={(e) => setDayOfWeek(e.target.value)}
              style={{ ...selectStyle, maxWidth: 220 }}
            >
              {Object.keys(DOW_MAP).map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {schedType === "monthly" && (
        <>
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "14px 0",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text2)",
                marginBottom: 5,
              }}
            >
              Day of month (1–31)
            </div>
            <input
              type="number"
              min={1}
              max={31}
              value={dayOfMonth}
              onChange={(e) =>
                setDayOfMonth(Math.min(31, Math.max(1, Number(e.target.value))))
              }
              style={{
                ...selectStyle,
                maxWidth: 120,
                MozAppearance: "textfield",
              }}
            />
          </div>
        </>
      )}

      {schedType === "custom" && (
        <>
          <div
            style={{
              height: 1,
              background: "var(--border)",
              margin: "14px 0",
            }}
          />
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "var(--text2)",
                marginBottom: 5,
              }}
            >
              Repeat every N days
            </div>
            <input
              type="number"
              min={1}
              max={365}
              value={intervalDays}
              onChange={(e) =>
                setIntervalDays(Math.max(1, Number(e.target.value)))
              }
              style={{
                ...selectStyle,
                maxWidth: 120,
                MozAppearance: "textfield",
              }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default TimeConfiguration;
