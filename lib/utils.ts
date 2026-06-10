import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const themeColors = [
  "#212121", // Soft Black
  "#E57373", // Light Red
  "#64B5F6", // Light Blue
  "#81C784", // Light Green
  "#FFF176", // Light Yellow
  "#FFB74D", // Light Orange
  "#BA68C8", // Light Purple
  "#4DB6AC", // Light Teal
  "#AED581", // Light Lime
  "#FF8A65", // Light Coral
  "#A1887F", // Light Brown
  "#F06292", // Light Pink
  "#7986CB", // Light Indigo
  "#FFD54F", // Light Amber
  "#FFEB3B", // Bright Yellow
];

export const resumeTemplates = [
  { id: "classic", name: "Classic" },
  { id: "modern", name: "Modern" },
  { id: "elegant", name: "Elegant" },
  { id: "minimal", name: "Minimal" },
  { id: "sidebar", name: "Sidebar" },
  { id: "executive", name: "Executive" },
  { id: "compact", name: "Compact" },
  { id: "bold", name: "Bold" },
] as const;

export type ResumeTemplateId = (typeof resumeTemplates)[number]["id"];

export const stripHtml = (html: string): string => {
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Replaces non-breaking spaces (Quill emits them for consecutive spaces)
 * with regular spaces. Keeps resume text ATS-parseable and lets the
 * browser wrap lines at word boundaries.
 */
export const sanitizeNbsp = (html: string): string => {
  return html.replace(/&nbsp;|\u00A0/g, " ");
};
