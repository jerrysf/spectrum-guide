import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-24 text-center">
      <p className="text-primary text-5xl font-bold">404</p>
      <h1 className="mt-4 text-2xl font-bold">页面不存在</h1>
      <p className="text-muted-foreground mt-3">
        你访问的页面可能已被移动或删除。可以试试搜索，或返回首页。
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">返回首页</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/search">全站搜索</Link>
        </Button>
      </div>
    </div>
  );
}
