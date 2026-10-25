import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-");
  return `${y} 年 ${Number(m)} 月 ${Number(d)} 日`;
}

export const SITE_NAME = "星伴成长";
export const SITE_EN_NAME = "Spectrum Guide";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
export const SITE_DESCRIPTION =
  "为家长、特教老师和康复师提供可信的自闭症知识、实用课程与成长支持工具。";
export const CONTACT_EMAIL = "hello@example.com";
