import mongoose from "mongoose";
import { themeColors } from "../utils";

const resumeSchema = new mongoose.Schema({
  resumeId: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  title: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  firstName: { type: String },
  lastName: { type: String },
  jobTitle: { type: String },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  summary: { type: String },
  experience: [{ type: mongoose.Schema.Types.ObjectId, ref: "Experience" }],
  education: [{ type: mongoose.Schema.Types.ObjectId, ref: "Education" }],
  skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
  themeColor: { type: String, default: themeColors[0] },
  template: { type: String, default: "classic" },
  // Display order of the reorderable body sections (summary stays fixed).
  sectionOrder: {
    type: [String],
    default: ["experience", "education", "skills"],
  },
  // "bars" (rating bars) or "list" (plain comma-separated, ATS-friendly).
  skillsStyle: { type: String, default: "bars" },
  // Date display format id (see resumeDateFormats in lib/utils).
  dateFormat: { type: String, default: "default" },
  // Built-in sections the owner has hidden (data is kept, just not shown).
  hiddenSections: { type: [String], default: [] },
  // User-defined sections with rich-text bodies, rendered after built-ins.
  customSections: {
    type: [
      {
        title: { type: String },
        body: { type: String },
      },
    ],
    default: [],
  },
  // Opt-in sharing: resumes are private until the owner makes them public.
  isPublic: { type: Boolean, default: false },
});

const Resume = mongoose.models.Resume || mongoose.model("Resume", resumeSchema);

export default Resume;
