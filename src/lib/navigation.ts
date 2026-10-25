export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const MAIN_NAV: NavItem[] = [
  { label: "科普知识", href: "/knowledge" },
  { label: "评估工具", href: "/assessment" },
  { label: "干预课程", href: "/courses" },
  { label: "资源下载", href: "/resources" },
  { label: "机构名录", href: "/directory", badge: "筹备中" },
];

export const FOOTER_NAV: { title: string; items: NavItem[] }[] = [
  {
    title: "内容",
    items: [
      { label: "科普知识", href: "/knowledge" },
      { label: "干预课程", href: "/courses" },
      { label: "资源下载", href: "/resources" },
      { label: "安全指南", href: "/safety" },
      { label: "发展能力观察", href: "/assessment/development" },
    ],
  },
  {
    title: "专区",
    items: [
      { label: "家长专区", href: "/parent-guide" },
      { label: "专业人员专区", href: "/professional" },
      { label: "机构名录", href: "/directory", badge: "筹备中" },
      { label: "问答社区", href: "/directory#community", badge: "筹备中" },
    ],
  },
  {
    title: "关于",
    items: [
      { label: "平台介绍", href: "/about" },
      { label: "循证与审核标准", href: "/about/evidence" },
      { label: "隐私政策", href: "/about/privacy" },
      { label: "免责声明", href: "/about/disclaimer" },
      { label: "内容纠错", href: "/about#corrections" },
    ],
  },
];
