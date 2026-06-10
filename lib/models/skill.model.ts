import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  name: { type: String },
  rating: { type: Number },
  // Optional group label ("Backend", "Frontend", ...) for the plain-list style.
  category: { type: String },
});

const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);

export default Skill;
