interface ProgressBarProps {
  value: number;
}

export const ProgressBar = ({ value }: ProgressBarProps) => {
  const safeValue = Math.max(0, Math.min(1, value));
  const width = `${Math.round(safeValue * 100)}%`;

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
      <div className="h-full rounded-full bg-emerald-500 transition-all duration-300" style={{ width }} />
    </div>
  );
};
