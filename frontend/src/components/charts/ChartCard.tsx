import { ReactNode, useRef } from 'react';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  right?: ReactNode;
}

export default function ChartCard({ title, subtitle, children, right }: ChartCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-xs sm:text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        {right && <div className="flex items-center gap-2">{right}</div>}
      </div>
      <div ref={ref} className="h-64 sm:h-72 lg:h-80">
        {children}
      </div>
    </div>
  );
}



