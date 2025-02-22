import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String },
  companyName: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  projectSummary: { type: String },
  githubRepo: { type: String }
});

const Project =
  mongoose.models.Project || mongoose.model("Project", projectSchema);

export default Project;
