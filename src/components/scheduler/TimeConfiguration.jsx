import React, { useState } from "react";
import { TIMEZONES, DOW_MAP } from "../../utils/schedulerConstants";
import { pad } from "../../utils/schedulerHelpers";
import { selectStyle } from "../../utils/schedulerStyles";
import AccessTimeFilledRoundedIcon from "@mui/icons-material/AccessTimeFilledRounded";

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
  const [isCardHovered, setIsCardHovered] = useState(false);

  return (
    <div
      style={{
        background: "var(--surface)",
        border: `1.5px solid rgba(75,123,245, ${isCardHovered ? "0.24" : "0.12"})`,
        borderRadius: "20px",
        padding: "18px 20px",
        marginBottom: 14,
        boxShadow: isCardHovered
          ? "0 12px 36px rgba(75, 123, 245, 0.15)"
          : "0 4px 16px rgba(75, 123, 245, 0.06)",
        transition: "all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
        transform: isCardHovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
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
            borderRadius: 10,
            background: "rgba(75,123,245,0.16)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <AccessTimeFilledRoundedIcon
            style={{ fontSize: 16, color: "#4B7BF5" }}
          />
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
