"use client";

import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PrintButton({ label = "打印本页" }: { label?: string }) {
  return (
    <Button type="button" onClick={() => window.print()} className="no-print">
      <Printer aria-hidden="true" />
      {label}
    </Button>
  );
}
