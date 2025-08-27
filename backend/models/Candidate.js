const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },          // Candidate full name
  role: { type: String, required: true },          // Job role (Frontend, Backend, etc.)
  experience: { type: Number, required: true },    // Years of experience
  resumeLink: { type: String },                    // Resume link (URL)
  email: { type: String },                         // Optional - recruiter may need this
  phone: { type: String },                         // Optional - contact number
  notes: { type: String },                         // Recruiter notes or comments
  status: {                                        // Pipeline stage
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied"
  },
  createdAt: { type: Date, default: Date.now }      
});

module.exports = mongoose.model("Candidate", candidateSchema);
