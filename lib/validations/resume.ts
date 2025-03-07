import * as z from "zod";
import { stripHtml } from "../utils";

export const name = z
  .string()
  .trim()
  .min(1, { message: "Name must be at least 1 characters long" });

export const jobTitle = z
  .string()
  .trim()
  .min(2, { message: "Job title must be at least 2 characters long" })
  .max(100, { message: "Job title must not exceed 100 characters" });

export const address = z
  .string()
  .trim()
  .min(5, { message: "Address must be at least 5 characters long" })
  .max(200, { message: "Address must not exceed 200 characters" });

export const phone = z
  .string()
  .trim()
  .regex(/^\+?[0-9]\d{8,14}$/, {
    message: "Phone number must be a valid number between 9-15 digits",
  });

export const email = z.string().email({ message: "Invalid email address" });

export const summary = z
  .string()
  .min(10, { message: "Summary must be at least 10 characters long" })
  .max(1000, { message: "Summary must not exceed 1000 characters" });

export const title = z.string().min(3, {
  message: "Position title must be at least 3 characters long",
});

export const companyName = z.string().min(3, {
  message: "Company name must be at least 3 characters long",
});

export const city = z.string().min(1, { message: "City is required" });

export const state = z.string().min(1, { message: "State is required" });

export const startDate = z
  .string()
  .min(1, { message: "Start date is required" });

export const endDate = z.string().optional();

export const descriptionSchema = z
  .string()
  .trim()
  .min(10, { message: " must be at least 10 characters" })
  .max(1500, { message: " must not exceed 1500 characters" })
  .refine(
    (value) => {
      const plainText = stripHtml(value);
      return plainText.length > 0;
    },
    { message: " cannot be empty or just whitespace" }
  );

export const universityName = z.string().min(3, {
  message: "University name must be at least 3 characters long",
});

export const degree = z.string().min(2, {
  message: "Degree must be at least 2 characters long",
});

export const major = z.string().min(3, {
  message: "Major must be at least 3 characters long",
});

export const rating = z
  .number()
  .min(1, { message: "Rating must be at least 1" });

export const ResumeNameValidationSchema = z.object({
  name,
});

export const PersonalDetailValidationSchema = z.object({
  firstName: name,
  lastName: name,
  jobTitle,
  address,
  phone,
  email,
});

export const SummaryValidationSchema = z.object({
  summary,
});

export const ExperienceValidationSchema = z.object({
  experience: z.array(
    z
      .object({
        title,
        companyName,
        city,
        state,
        startDate,
        endDate,
        workSummary: descriptionSchema,
      })
      .refine(
        (data) => {
          if (data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end >= start;
          }
          return true;
        },
        {
          message: "End date must be on or after the start date",
          path: ["endDate"],
        }
      )
  ),
});

export const EducationValidationSchema = z.object({
  education: z.array(
    z
      .object({
        universityName,
        degree,
        major,
        startDate,
        endDate,
        description: descriptionSchema,
      })
      .refine(
        (data) => {
          if (data.endDate) {
            const start = new Date(data.startDate);
            const end = new Date(data.endDate);
            return end >= start;
          }
          return true;
        },
        {
          message: "End date must be on or after the start date",
          path: ["endDate"],
        }
      )
  ),
});

export const SkillValidationSchema = z.object({
  skills: z.array(
    z.object({
      name,
      rating,
    })
  ),
});
