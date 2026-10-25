import Link from "next/link";
import { cn } from "@/lib/utils";

interface FilterBarProps {
  basePath: string;
  paramName: string;
  label: string;
  options: readonly string[];
  current?: string;
  /** 需要保留的其他查询参数 */
  preserved?: Record<string, string | undefined>;
}

export function FilterBar({
  basePath,
  paramName,
  label,
  options,
  current,
  preserved = {},
}: FilterBarProps) {
  function href(value?: string) {
    const params = new URLSearchParams();
    for (const [k, v] of Object.entries(preserved)) {
      if (v) params.set(k, v);
    }
    if (value) params.set(paramName, value);
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label={label}>
      <span className="text-muted-foreground text-sm">{label}</span>
      <Link
        href={href()}
        aria-current={!current ? "true" : undefined}
        className={cn(
          "rounded-full border px-3 py-1.5 text-sm transition-colors",
          !current
            ? "border-primary bg-primary text-primary-foreground"
            : "border-border bg-card hover:bg-muted",
        )}
      >
        全部
      </Link>
      {options.map((opt) => (
        <Link
          key={opt}
          href={href(opt)}
          aria-current={current === opt ? "true" : undefined}
          className={cn(
            "rounded-full border px-3 py-1.5 text-sm transition-colors",
            current === opt
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card hover:bg-muted",
          )}
        >
          {opt}
        </Link>
      ))}
    </div>
  );
}
