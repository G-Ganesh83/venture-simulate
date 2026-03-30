interface MetricBarProps {
  label: string;
  value: number;
  colorClass: string;
}

export default function MetricBar({
  label,
  value,
  colorClass,
}: MetricBarProps) {
  // Clamp value for visual bar width between 0 and 100
  const widthPercentage = Math.max(0, Math.min(100, value));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs font-semibold uppercase tracking-wider">
        <span className="text-[var(--muted)]">{label}</span>
        <span className="text-white">{Math.round(value)}</span>
      </div>
      <div className="h-2.5 w-full bg-black/40 rounded-full overflow-hidden border border-[var(--border)] relative">
        <div
          className={`absolute left-0 top-0 h-full transition-all duration-1000 ease-out ${colorClass}`}
          style={{ width: `${widthPercentage}%` }}
        />
      </div>
    </div>
  );
}
