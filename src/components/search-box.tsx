"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SearchBox({
  defaultValue = "",
  placeholder = "你想了解孩子的哪个问题？",
  size = "lg",
}: {
  defaultValue?: string;
  placeholder?: string;
  size?: "lg" | "default";
}) {
  const router = useRouter();
  return (
    <form
      role="search"
      action="/search"
      method="get"
      className="flex w-full gap-2"
      onSubmit={(e) => {
        // 使用原生 GET 提交即可获得可分享的 ?q= URL；这里拦截只是避免额外依赖
        e.preventDefault();
        const q = new FormData(e.currentTarget).get("q")?.toString() ?? "";
        router.push(`/search?q=${encodeURIComponent(q)}`);
      }}
    >
      <label htmlFor="site-search" className="sr-only">
        全站搜索
      </label>
      <div className="relative flex-1">
        <Search
          className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
          aria-hidden="true"
        />
        <Input
          id="site-search"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className={size === "lg" ? "h-13 pl-9 text-base" : "pl-9"}
          autoComplete="off"
        />
      </div>
      <Button type="submit" size={size === "lg" ? "lg" : "default"}>
        搜索
      </Button>
    </form>
  );
}
