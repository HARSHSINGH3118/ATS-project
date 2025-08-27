const mongoose = require("mongoose");

const CandidateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    role: { type: String, required: true },
    experience: { type: Number, required: true },
    email: String,
    phone: String,
    notes: String,
    status: {
      type: String,
      enum: ["Applied", "Interview", "Offer", "Rejected"],
      default: "Applied",
    },
    resumeLink: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", CandidateSchema);
