import * as React from "react";

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  className = "",
  action,
}) => {
  return (
    <div
      className={`bg-gray-800/60 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden ${className}`}
    >
      <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {action && <div className="flex items-center gap-2">{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

ChartCard.displayName = "ChartCard";

export { ChartCard };
export type { ChartCardProps };
