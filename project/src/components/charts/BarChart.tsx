// No es necesario importar React con el runtime automático

interface DataPoint {
  name: string;
  value: number;
  realValue?: number;
}

interface BarChartProps {
  data: DataPoint[];
  color?: string;
  height?: number;
}

export function BarChart({
  data,
  color = "#10b981",
  height = 200,
}: BarChartProps) {
  if (!data.length) return null;

  const maxValue = Math.max(...data.map((d) => d.value)) || 1;

  return (
    <div className="w-full overflow-y-hidden" style={{ height }}>
      {/* Contenedor scrollable para evitar desbordes horizontales */}
      <div className="h-full overflow-x-auto overflow-y-hidden">
        <div className="flex items-end h-full space-x-2 min-w-max px-1">
          {data.map((point, index) => {
            const heightPercentage = (point.value / maxValue) * 100;
            return (
              <div
                key={index}
                className="min-w-[48px] flex flex-col items-center h-full group"
              >
                {/* Wrapper con altura fija para que el % funcione */}
                <div className="flex-1 w-full flex items-end">
                  <div
                    className="w-full rounded-t transition-all duration-300 hover:opacity-80 relative"
                    style={{
                      height: `${heightPercentage}%`,
                      backgroundColor: color,
                      minHeight: "4px",
                    }}
                  >
                    {point.realValue !== undefined && (
                      <div className="absolute bottom-full mb-1 hidden group-hover:block text-xs text-white bg-black px-2 py-1 rounded">
                        ${point.realValue.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className="text-xs text-gray-500 mt-2 text-center truncate w-full"
                  title={point.name}
                >
                  {point.name}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
