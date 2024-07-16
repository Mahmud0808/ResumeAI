import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  title: { type: String },
  companyName: { type: String },
  city: { type: String },
  state: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  workSummary: { type: String },
});

const Experience =
  mongoose.models.Experience || mongoose.model("Experience", experienceSchema);

export default Experience;
