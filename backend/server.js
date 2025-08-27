const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const connectDB = require("./config/db");
const candidateRoutes = require("./routes/candidateRoutes");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");


const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/candidates", candidateRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/candidates", authMiddleware, candidateRoutes); 
connectDB();

 
app.get("/", (req, res) => {
  res.send("ATS Backend is running ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
 