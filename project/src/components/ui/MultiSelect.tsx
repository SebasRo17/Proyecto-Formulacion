// No React import needed with automatic JSX runtime

interface Option {
  value: string;
  label: string;
}
interface MultiSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seleccionar...",
}: MultiSelectProps) {
  const toggle = (val: string) => {
    if (value.includes(val)) onChange(value.filter((v) => v !== val));
    else onChange([...value, val]);
  };
  return (
    <div className="border rounded-lg p-2">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm text-gray-500">{placeholder}</div>
        <div className="space-x-2 text-xs">
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => onChange(options.map((o) => o.value))}
          >
            Seleccionar todo
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded border hover:bg-gray-50"
            onClick={() => onChange([])}
          >
            Limpiar
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-auto">
        {options.map((opt) => {
          const checked = value.includes(opt.value);
          return (
            <div
              key={opt.value}
              className={`flex items-center justify-between px-3 py-2 rounded border cursor-pointer select-none ${
                checked ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"
              }`}
              onClick={() => toggle(opt.value)}
            >
              <span className="text-sm text-gray-700 mr-3 truncate">
                {opt.label}
              </span>
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(opt.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
