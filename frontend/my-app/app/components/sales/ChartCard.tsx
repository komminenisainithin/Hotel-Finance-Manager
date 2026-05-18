type ChartCardProps = {
  title: string;
  subtitle: string;
  legend?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <span
        className="h-2.5 w-2.5 rounded-sm"
        style={{ backgroundColor: color }}
      />
      {label}
    </span>
  );
}

export default function ChartCard({
  title,
  subtitle,
  legend,
  children,
  className = "",
}: ChartCardProps) {
  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white p-4 ${className}`}
    >
      <h3 className="text-sm font-medium text-gray-900">{title}</h3>
      <p className="mb-3 text-xs text-gray-500">{subtitle}</p>
      {legend && <div className="mb-2.5 flex flex-wrap gap-3.5">{legend}</div>}
      {children}
    </div>
  );
}
