"use client";

import { useEffect, useState } from "react";
import { event } from "@/lib/event";

function parts(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60) };
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const start = new Date(event.startsAt).getTime();
  // قبل ما يتحمّل الوقت بالمتصفح بنحجز نفس المساحة عشان الصفحة ما تنط
  if (now === null) return <div className="countdown" aria-hidden />;
  if (now >= start) return null;

  const { days, hours, minutes } = parts(start - now);
  return (
    <div className="countdown" role="timer" aria-label={`باقي ${days} يوم و${hours} ساعة على الحفلة`}>
      <div>
        <b key={days}>{days}</b>
        <span>يوم</span>
      </div>
      <div>
        <b key={hours}>{hours}</b>
        <span>ساعة</span>
      </div>
      <div>
        <b key={minutes}>{minutes}</b>
        <span>دقيقة</span>
      </div>
    </div>
  );
}
