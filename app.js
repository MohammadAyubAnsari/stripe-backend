const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5003;

// Middleware
app.use(express.json()); // To parse incoming JSON data
app.use(cors()); // Enable cross-origin requests
// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow requests from your frontend
//   })
// );

// MongoDB connection (replace with your MongoDB URI)
mongoose
  .connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  wallet: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// POST route to store user data
app.post("/api/users", async (req, res) => {
  try {
    const { name, wallet } = req.body;
    const newUser = new User({ name, wallet });
    await newUser.save();
    res.status(201).json({ message: "User data stored successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error storing data", error });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
