import type { MetadataRoute } from "next";
import { getArticles, getCourses, getResources, getSafetyGuides } from "@/lib/content";
import { SITE_URL } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/knowledge",
    "/assessment",
    "/assessment/development",
    "/courses",
    "/resources",
    "/safety",
    "/directory",
    "/search",
    "/parent-guide",
    "/professional",
    "/about",
    "/about/evidence",
    "/about/privacy",
    "/about/disclaimer",
  ].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
  }));

  const articles = getArticles().map(({ meta }) => ({
    url: `${SITE_URL}/knowledge/${meta.slug}`,
    lastModified: new Date(meta.lastUpdated),
  }));
  const courses = getCourses().map(({ meta }) => ({
    url: `${SITE_URL}/courses/${meta.slug}`,
    lastModified: new Date(meta.lastUpdated),
  }));
  const resources = getResources().map(({ meta }) => ({
    url: `${SITE_URL}/resources/${meta.slug}`,
    lastModified: new Date(meta.lastUpdated),
  }));
  const safety = getSafetyGuides().map(({ meta }) => ({
    url: `${SITE_URL}/safety/${meta.slug}`,
    lastModified: new Date(meta.lastUpdated),
  }));

  return [...staticRoutes, ...articles, ...courses, ...resources, ...safety];
}
