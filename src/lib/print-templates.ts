/**
 * 资源打印模板清单。
 * 每个 id 对应 src/components/print-templates/ 下的一个 React 组件，
 * 数据来自 resource MDX frontmatter 的 templateData。
 */
export const PRINT_TEMPLATES = [
  "visual-schedule",
  "communication-cards",
  "social-story",
  "self-care-steps",
  "abc-observation",
  "teaching-record",
  "daily-log",
  "home-school-note",
] as const;

export type PrintTemplateId = (typeof PRINT_TEMPLATES)[number];

export const PRINT_TEMPLATE_LABELS: Record<PrintTemplateId, string> = {
  "visual-schedule": "视觉日程网格",
  "communication-cards": "沟通卡网格",
  "social-story": "社交故事单页",
  "self-care-steps": "步骤流程卡",
  "abc-observation": "ABC 行为观察表",
  "teaching-record": "教学记录表",
  "daily-log": "日常记录表",
  "home-school-note": "家校沟通表",
};
