import { z } from "zod";
import {
  EducationValidationSchema,
  ExperienceValidationSchema,
} from "./validations/resume";

export const personalDetailFields = [
  { name: "firstName", label: "First Name", type: "text", fullWidth: false },
  { name: "lastName", label: "Last Name", type: "text", fullWidth: false },
  { name: "jobTitle", label: "Job Title", type: "text", fullWidth: true },
  { name: "address", label: "Address", type: "text", fullWidth: true },
  { name: "phone", label: "Phone", type: "number", fullWidth: false },
  { name: "email", label: "Email", type: "email", fullWidth: false },
] as const;

type Experience = z.infer<
  typeof ExperienceValidationSchema
>["experience"][number];

interface ExperienceFields {
  name: keyof Experience;
  label: string;
  type: "text" | "date" | "richText";
  colSpan?: string;
}

export const experienceFields: ExperienceFields[] = [
  { name: "title", label: "Position Title", type: "text" },
  { name: "companyName", label: "Company Name", type: "text" },
  { name: "city", label: "City", type: "text" },
  { name: "state", label: "State", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  {
    name: "workSummary",
    label: "Summary",
    type: "richText",
    colSpan: "col-span-2",
  },
];

type Education = z.infer<typeof EducationValidationSchema>["education"][number];

interface EducationField {
  name: keyof Education;
  label: string;
  type: "text" | "date" | "textarea";
  colSpan?: string;
}

export const educationFields: EducationField[] = [
  {
    name: "universityName",
    label: "Name of Institute",
    type: "text",
    colSpan: "col-span-2",
  },
  { name: "degree", label: "Degree", type: "text" },
  { name: "major", label: "City", type: "text" },
  { name: "startDate", label: "Start Date", type: "date" },
  { name: "endDate", label: "End Date", type: "date" },
  {
    name: "description",
    label: "Description",
    type: "textarea",
    colSpan: "col-span-2",
  },
];
