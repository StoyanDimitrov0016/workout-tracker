import { useEffect, useState } from "react";

import { TIMER_PRESETS } from "@/features/start-session/constants/timer";

export function useRestTimer() {
  const [seconds, setSeconds] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || seconds === null) return;
    if (seconds <= 0) {
      setIsRunning(false);
      return;
    }

    const handle = setInterval(() => {
      setSeconds((previous) => (previous !== null && previous > 0 ? previous - 1 : 0));
    }, 1000);

    return () => clearInterval(handle);
  }, [isRunning, seconds]);

  return {
    seconds,
    selectPreset(nextSeconds: number) {
      setIsRunning(false);
      setSeconds(nextSeconds);
    },
    start() {
      setSeconds((previous) => previous ?? TIMER_PRESETS[0]?.seconds ?? 0);
      setIsRunning(true);
    },
    pause() {
      setIsRunning(false);
    },
    reset() {
      setIsRunning(false);
      setSeconds(null);
    },
  };
}
