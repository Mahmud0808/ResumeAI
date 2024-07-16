import * as z from "zod";

export const ResumeNameValidationSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});
