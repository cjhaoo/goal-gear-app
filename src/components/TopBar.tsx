import { useEffect, useState } from 'react';
import { getSecondsRemainingToday } from '@/services/timeService';

const formatHhMmSs = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');
  const seconds = Math.floor(safeSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
};

const formatHhMm = (totalSeconds: number): string => {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600)
    .toString()
    .padStart(2, '0');
  const minutes = Math.floor((safeSeconds % 3600) / 60)
    .toString()
    .padStart(2, '0');

  return `${hours}:${minutes}`;
};

export const TopBar = () => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(getSecondsRemainingToday());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsRemaining(getSecondsRemainingToday());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  return (
    <header className="flex items-center justify-between rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100">
      <div className="text-sm font-medium">⏰ {formatHhMmSs(secondsRemaining)}</div>
      <div className="text-sm text-blue-300">💰 {formatHhMm(secondsRemaining)}</div>
      <button
        type="button"
        className="rounded-md border border-slate-500 px-2 py-1 text-xs text-slate-200 transition hover:border-blue-400 hover:text-blue-300"
      >
        ⚙️ 設定
      </button>
    </header>
  );
};
