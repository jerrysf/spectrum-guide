import Link from "next/link";
import { FOOTER_NAV } from "@/lib/navigation";
import { Badge } from "@/components/ui/badge";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/utils";

export function SiteFooter() {
  return (
    <footer className="no-print border-border bg-muted/50 mt-16 border-t">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-semibold">{SITE_NAME}</p>
            <p className="text-muted-foreground mt-2 text-sm">
              循证、温和、可操作的自闭症知识与家庭支持平台。
            </p>
            <p className="text-muted-foreground mt-4 text-xs">
              本站内容不构成医疗建议，不能替代专业评估与诊断。
            </p>
          </div>
          {FOOTER_NAV.map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <p className="text-sm font-semibold">{group.title}</p>
              <ul className="mt-3 space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm hover:underline"
                    >
                      {item.label}
                    </Link>
                    {item.badge && (
                      <Badge variant="amber" className="ml-1.5">
                        {item.badge}
                      </Badge>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="border-border text-muted-foreground mt-10 flex flex-col gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · 内容按页面标注的方式审核与发布
          </p>
          <p>
            联系与内容纠错：
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary hover:underline">
              {CONTACT_EMAIL}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
