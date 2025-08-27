const mongoose = require("mongoose");

const candidateSchema = new mongoose.Schema({
  name: { type: String, required: true },           
  role: { type: String, required: true },           
  experience: { type: Number, required: true },     
  resumeLink: { type: String },                     
  email: { type: String },                          
  phone: { type: String },                          
  notes: { type: String },                          
  status: {                                         
    type: String,
    enum: ["Applied", "Interview", "Offer", "Rejected"],
    default: "Applied"
  },
  createdAt: { type: Date, default: Date.now }      
});

module.exports = mongoose.model("Candidate", candidateSchema);
