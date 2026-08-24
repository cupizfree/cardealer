"use client";

import { useEffect, useState } from "react";

type Remaining = { days: number; hours: string; mins: string; secs: string };

function pad(value: number) {
  return String(value).padStart(2, "0");
}

// Migrated from ../aurexo/coming-soon.html's `<span class="js-countdown" data-timer="1065550">`,
// driven in source by `assets/js/count-down.js` — a genuinely real, working vanilla countdown (not
// decorative UI, unlike most unwired forms/calculators this session): on load it computes an end time
// as `now + data-timer seconds`, builds the digit markup, and re-renders every second via
// `setInterval` until it hits zero. `seconds` is literally source's own `data-timer` value (1065550s,
// ~12.3 days) — since it's "seconds from page load," not a fixed calendar date, the countdown always
// restarts at ~12.3 days remaining on every fresh page load, matching source's own literal behavior
// (a rolling demo countdown, not a real fixed launch date).
//
// Source's own `getTimeFormat` zero-pads hours/mins/secs to 2 digits but leaves `days` unpadded
// (`this.days.textContent = days`, no `getTimeFormat` call) — preserved as that same asymmetry, not
// "fixed" into padding days too.
export default function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState<Remaining | null>(null);

  useEffect(() => {
    const endTime = Date.now() + seconds * 1000;

    const tick = () => {
      const totalSeconds = Math.floor((endTime - Date.now()) / 1000);
      if (totalSeconds < 0) {
        clearInterval(intervalId);
        setRemaining({ days: 0, hours: "00", mins: "00", secs: "00" });
        return;
      }
      const days = Math.floor(totalSeconds / 86400);
      const afterDays = totalSeconds % 86400;
      const hours = Math.floor(afterDays / 3600);
      const afterHours = afterDays % 3600;
      const mins = Math.floor(afterHours / 60);
      const secs = afterHours % 60;
      setRemaining({ days, hours: pad(hours), mins: pad(mins), secs: pad(secs) });
    };

    const intervalId = setInterval(tick, 1000);
    tick();

    return () => clearInterval(intervalId);
  }, [seconds]);

  if (!remaining) return <span className="js-countdown" />;

  return (
    <span className="js-countdown">
      <div className="countdown__timer" aria-hidden="true">
        <span className="countdown__item">
          <span className="countdown__value countdown__value--0">{remaining.days}</span>
        </span>
        <span className="countdown__item">
          <span className="countdown__value countdown__value--1">{remaining.hours}</span>
        </span>
        <span className="countdown__item">
          <span className="countdown__value countdown__value--2">{remaining.mins}</span>
        </span>
        <span className="countdown__item">
          <span className="countdown__value countdown__value--3">{remaining.secs}</span>
        </span>
      </div>
    </span>
  );
}
