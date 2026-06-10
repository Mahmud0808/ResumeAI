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

export const resumeDateFormats = [
  { id: "default", name: "As typed", example: "2023-07-05" },
  // Month + year (most common on resumes)
  { id: "mmm-yyyy", name: "Short month", example: "Jul 2023" },
  { id: "mmmm-yyyy", name: "Full month", example: "July 2023" },
  { id: "mm-yyyy", name: "Numeric month", example: "07/2023" },
  { id: "mm-dot-yyyy", name: "Numeric month, dots", example: "07.2023" },
  { id: "yyyy", name: "Year only", example: "2023" },
  // Full dates, day first (UK / Europe / most of the world)
  { id: "dd-mmm-yyyy", name: "Day, short month", example: "05 Jul 2023" },
  { id: "dd-mmmm-yyyy", name: "Day, full month", example: "05 July 2023" },
  { id: "dd-mm-yyyy", name: "Day first", example: "05/07/2023" },
  { id: "dd-dot-mm-yyyy", name: "Day first, dots", example: "05.07.2023" },
  // Full dates, month first (US)
  { id: "mmm-dd-yyyy", name: "US short month", example: "Jul 5, 2023" },
  { id: "mmmm-dd-yyyy", name: "US full month", example: "July 5, 2023" },
  { id: "mm-dd-yyyy", name: "US numeric", example: "07/05/2023" },
  // Year first (ISO / East Asia)
  { id: "yyyy-mm-dd", name: "ISO", example: "2023-07-05" },
  { id: "yyyy-slash-mm-dd", name: "Year first, slashes", example: "2023/07/05" },
] as const;

export type ResumeDateFormatId = (typeof resumeDateFormats)[number]["id"];

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/**
 * Formats an ISO date string (YYYY-MM-DD, as produced by date inputs) per the
 * resume's date format setting. Unparseable values pass through untouched so
 * legacy free-text dates keep rendering.
 */
export const formatResumeDate = (
  value: string | undefined | null,
  format: string | undefined | null
): string => {
  if (!value) {
    return "";
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!match || !format || format === "default") {
    return value;
  }

  const [, year, month, day] = match;
  const monthIndex = Number(month) - 1;
  if (monthIndex < 0 || monthIndex > 11) {
    return value;
  }
  const monthName = MONTH_NAMES[monthIndex];

  const shortMonth = monthName.slice(0, 3);
  const dayNum = Number(day);

  switch (format) {
    case "mmm-yyyy":
      return `${shortMonth} ${year}`;
    case "mmmm-yyyy":
      return `${monthName} ${year}`;
    case "mm-yyyy":
      return `${month}/${year}`;
    case "mm-dot-yyyy":
      return `${month}.${year}`;
    case "yyyy":
      return year;
    case "dd-mmm-yyyy":
      return `${day} ${shortMonth} ${year}`;
    case "dd-mmmm-yyyy":
      return `${day} ${monthName} ${year}`;
    case "dd-mm-yyyy":
      return `${day}/${month}/${year}`;
    case "dd-dot-mm-yyyy":
      return `${day}.${month}.${year}`;
    case "mmm-dd-yyyy":
      return `${shortMonth} ${dayNum}, ${year}`;
    case "mmmm-dd-yyyy":
      return `${monthName} ${dayNum}, ${year}`;
    case "mm-dd-yyyy":
      return `${month}/${day}/${year}`;
    case "yyyy-mm-dd":
      return `${year}-${month}-${day}`;
    case "yyyy-slash-mm-dd":
      return `${year}/${month}/${day}`;
    default:
      return value;
  }
};

// Built-in sections the user can hide from the resume (data is kept).
export const hideableSections = [
  { id: "summary", name: "Summary" },
  { id: "experience", name: "Professional Experience" },
  { id: "education", name: "Education" },
  { id: "skills", name: "Skills" },
] as const;

/**
 * Replaces non-breaking spaces (Quill emits them for consecutive spaces)
 * with regular spaces. Keeps resume text ATS-parseable and lets the
 * browser wrap lines at word boundaries.
 */
export const sanitizeNbsp = (html: string): string => {
  return html.replace(/&nbsp;|\u00A0/g, " ");
};
