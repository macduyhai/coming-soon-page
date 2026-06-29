"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Đọc từ env — fallback 2026-10-01 nếu chưa cấu hình
const LAUNCH = new Date(
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-10-01T00:00:00Z"
);

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function calcTimeLeft(): TimeLeft {
  const diff = Math.max(0, LAUNCH.getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1_000) % 60),
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function DigitBlock({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex flex-col items-center gap-2 rounded-xl px-4 py-3 sm:px-6 sm:py-4"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(79,70,229,0.12)",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        minWidth: "64px",
      }}
    >
      <div
        className="font-mono text-3xl sm:text-5xl font-medium tabular-nums overflow-hidden"
        style={{ color: "#14103A", lineHeight: 1 }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={value}
            initial={{ y: -14, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 14, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="block"
          >
            {value}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase"
        style={{ color: "#6B7280" }}
      >
        {label}
      </span>
    </div>
  );
}

const SKELETON = ["Ngày", "Giờ", "Phút", "Giây"];

export default function Countdown() {
  const [time, setTime] = useState<TimeLeft | null>(null);

  useEffect(() => {
    setTime(calcTimeLeft());
    const id = setInterval(() => setTime(calcTimeLeft()), 1_000);
    return () => clearInterval(id);
  }, []);

  if (!time) {
    return (
      <div className="flex gap-3 sm:gap-4">
        {SKELETON.map((label) => (
          <div
            key={label}
            className="flex flex-col items-center gap-2 rounded-xl px-4 py-3 sm:px-6 sm:py-4"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(79,70,229,0.12)",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              minWidth: "64px",
            }}
          >
            <span
              className="font-mono text-3xl sm:text-5xl font-medium"
              style={{ color: "#14103A", lineHeight: 1 }}
            >
              --
            </span>
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-[0.22em] uppercase"
              style={{ color: "#6B7280" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="flex gap-3 sm:gap-4"
      role="timer"
      aria-label="Thời gian còn lại đến ngày ra mắt"
      aria-live="off"
    >
      <DigitBlock label="Ngày" value={pad(time.days)} />
      <DigitBlock label="Giờ" value={pad(time.hours)} />
      <DigitBlock label="Phút" value={pad(time.minutes)} />
      <DigitBlock label="Giây" value={pad(time.seconds)} />
    </div>
  );
}
