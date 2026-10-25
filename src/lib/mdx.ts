export interface TocItem {
  depth: number;
  text: string;
  id: string;
}

function slugifyHeading(text: string): string {
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\p{Letter}\p{Number}-]/gu, "");
}

/** 从 markdown/mdx 正文提取 h2/h3 生成目录 */
export function extractToc(body: string): TocItem[] {
  const used = new Map<string, number>();
  return body
    .split("\n")
    .filter((line) => /^#{2,3}\s+/.test(line))
    .map((line) => {
      const depth = line.startsWith("###") ? 3 : 2;
      const text = line.replace(/^#{2,3}\s+/, "").trim();
      const base = slugifyHeading(text);
      const n = (used.get(base) ?? 0) + 1;
      used.set(base, n);
      return { depth, text, id: n > 1 ? `${base}-${n}` : base };
    });
}
