"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { MAIN_NAV } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="no-print border-border bg-background/95 sticky top-0 z-40 border-b backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold" aria-label="星伴成长首页">
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            fill="none"
            aria-hidden="true"
            className="text-primary"
          >
            <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2.5" />
            <path
              d="M11 20c0-3 2.5-5 5-5s5-2 5-5"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="11" cy="20" r="2" fill="currentColor" />
          </svg>
          <span className="hidden sm:inline">星伴成长</span>
        </Link>

        <nav aria-label="主导航" className="hidden flex-1 items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-foreground/80 hover:bg-muted hover:text-foreground rounded-md px-3 py-2 text-sm font-medium"
            >
              {item.label}
              {item.badge && (
                <Badge variant="amber" className="ml-1.5">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link href="/search">
              <Search aria-hidden="true" />
              全站搜索
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "关闭菜单" : "打开菜单"}
          >
            {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="移动端导航"
          className="border-border bg-background border-t px-4 pb-4 lg:hidden"
        >
          <ul className="flex flex-col">
            {MAIN_NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="hover:bg-muted flex items-center justify-between rounded-md px-2 py-3 text-base font-medium"
                >
                  {item.label}
                  {item.badge && <Badge variant="amber">{item.badge}</Badge>}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/search"
                onClick={() => setOpen(false)}
                className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-3 text-base font-medium"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
                全站搜索
              </Link>
            </li>
            <li>
              <Link
                href="/safety"
                onClick={() => setOpen(false)}
                className="hover:bg-muted flex items-center gap-2 rounded-md px-2 py-3 text-base font-medium"
              >
                安全指南
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
