import type { ReactNode } from "react";

export function PageHeader({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-border bg-muted/40 border-b">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {description && <p className="text-muted-foreground mt-3 max-w-2xl">{description}</p>}
        {children}
      </div>
    </div>
  );
}
