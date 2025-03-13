require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Schema
const Note = mongoose.model("Note", new mongoose.Schema({ text: String, createdAt: { type: Date, default: Date.now } }));

// Routes
app.post("/add-note", async (req, res) => {
  const note = new Note({ text: req.body.text });
  await note.save();
  res.json(note);
});

app.get("/notes", async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// File Upload Setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  res.json({ filePath: req.file.path });
});

// Start Server
app.listen(5000, () => console.log("Server running on port 5000"));
