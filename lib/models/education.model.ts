import mongoose from "mongoose";

const educationSchema = new mongoose.Schema({
  universityName: { type: String },
  degree: { type: String },
  major: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  description: { type: String },
});

const Education =
  mongoose.models.Education || mongoose.model("Education", educationSchema);

export default Education;
