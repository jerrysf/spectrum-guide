import type { MDXComponents } from "mdx/types";
import type { ReactNode } from "react";

function Callout({
  type = "info",
  children,
}: {
  type?: "info" | "warning" | "danger";
  children: ReactNode;
}) {
  const styles = {
    info: "border-primary/40 bg-primary-soft/60",
    warning: "border-amber-600/30 bg-accent-amber",
    danger: "border-destructive/40 bg-red-50",
  } as const;
  return <div className={`my-4 rounded-md border-l-4 p-4 text-sm ${styles[type]}`}>{children}</div>;
}

export const mdxComponents: MDXComponents = {
  Callout,
};
