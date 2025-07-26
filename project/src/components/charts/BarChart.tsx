import React from 'react';

interface DataPoint {
  name: string;
  value: number;
}

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function BarChart({ data, color = '#10b981', height = 200 }: BarChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map(d => d.value));

  return (
    <div className="w-full" style={{ height }}>
      <div className="flex items-end justify-between h-full space-x-2">
        {data.map((point, index) => {
          const heightPercentage = (point.value / maxValue) * 100;
          return (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full rounded-t transition-all duration-300 hover:opacity-80"
                style={{
                  height: `${heightPercentage}%`,
                  backgroundColor: color,
                  minHeight: '4px'
                }}
              />
              <span className="text-xs text-gray-500 mt-2 text-center">{point.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}