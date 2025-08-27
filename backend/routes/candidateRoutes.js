const express = require("express");
const router = express.Router();
const Candidate = require("../models/Candidate");
const upload = require("../config/multer");   

 
router.post("/", async (req, res) => {
  try {
    const candidate = new Candidate(req.body);
    await candidate.save();
    res.status(201).json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 
router.get("/", async (req, res) => {
  try {
    const filters = {};
    if (req.query.role) filters.role = req.query.role;
    if (req.query.status) filters.status = req.query.status;

    const candidates = await Candidate.find(filters);
    res.json(candidates);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

 
router.put("/:id", async (req, res) => {
  try {
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(candidate);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

 
router.post("/:id/uploadResume", upload.single("resume"), async (req, res) => {
  try {
    console.log("File received:", req.file);

    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "Resume upload failed" });
    }

     
    const candidate = await Candidate.findByIdAndUpdate(
      req.params.id,
      { resumeLink: req.file.path },
      { new: true }
    );

    res.json(candidate);
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(400).json({ error: err.message });
  }
});

 
router.get("/analytics/data", async (req, res) => {
  try {
    const candidates = await Candidate.find();

    const stageCount = { Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    const roleCount = {};
    let totalExp = 0;

    candidates.forEach(c => {
      stageCount[c.status]++;
      roleCount[c.role] = (roleCount[c.role] || 0) + 1;
      totalExp += c.experience;
    });

    const avgExp = candidates.length
      ? (totalExp / candidates.length).toFixed(1)
      : 0;

    res.json({
      stageCount,
      roleCount,
      averageExperience: avgExp
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
