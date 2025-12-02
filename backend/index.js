import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import UserModel from "./models/User.js";
import ProgramModel, { ProgramInfoModel } from "./models/Program.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;

// Middleware
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGO_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(
        ` Database Connected and Server is running on port ${PORT}`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });


// Category Schema (still defined here as it's only used in index.js)
const categorySchema = new mongoose.Schema({
    // Collection: categories
    label: {
        type: String, // e.g., "Hypertrophy"
        required: true,
    },
    slug: {
        type: String, // e.g., "hypertrophy" for URL friendliness
        required: true,
        unique: true,
    },
    type: {
        type: String, // e.g., 'goal', 'equipment', 'duration'
        required: true,
    },
});

// Note: ProgramModel and ProgramInfoModel are now imported from ./models/Program.js
const CategoryModel = mongoose.model("categories", categorySchema);

// Routes
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Authentication routes
app.use("/api/auth", authRoutes);

// User routes (profile management)
app.use("/api/users", userRoutes);

// Admin routes
app.use("/api/admin", adminRoutes);


app.get("/getUsers", async (req, res) => {
    const userData = await UserModel.find();
    res.json(userData);
});

app.get("/getPrograms", async (req, res) => {
    const programData = await ProgramModel.find();
    res.json(programData);
});

app.get("/getCategories", async (req, res) => {
    const categoryData = await CategoryModel.find();
    res.json(categoryData);
});

// ================================
// POST routes (create / update)
// ================================

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const { username, email, role } = req.body;

    const user = new UserModel({
      username,
      email,
      role,
    });

    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Failed to create user", error: error.message });
  }
});

// Create a new program (including optional programInfo)
app.post("/programs", async (req, res) => {
  try {
    const {
      title,
      shortLabel,
      summary,
      description,
      tags,
      durationHint,
      type,
      isPublic,
      authorId,
      authorName,
      rating,
      ratingCount,
      programInfo,
    } = req.body;

    const program = new ProgramModel({
      title,
      shortLabel,
      summary,
      description,
      tags,
      durationHint,
      type,
      isPublic,
      authorId,
      authorName,
      rating,
      ratingCount,
      programInfo,
    });

    const savedProgram = await program.save();
    res.status(201).json(savedProgram);
  } catch (error) {
    console.error("Error creating program:", error);
    res.status(400).json({ message: "Failed to create program", error: error.message });
  }
});

// Update only the programInfo (days / exercises / sets) for a program
app.post("/programs/:id/programInfo", async (req, res) => {
  try {
    const { id } = req.params;
    const { programInfo } = req.body;

    const updated = await ProgramModel.findByIdAndUpdate(
      id,
      { $set: { programInfo } },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating programInfo:", error);
    res.status(400).json({ message: "Failed to update programInfo", error: error.message });
  }
});

// Create a new category
app.post("/categories", async (req, res) => {
  try {
    const { label, slug, type } = req.body;

    const category = new CategoryModel({
      label,
      slug,
      type,
    });

    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ message: "Failed to create category", error: error.message });
  }
});

// Add a saved program entry to a user (Vault)
app.post("/users/:id/saved-programs", async (req, res) => {
  try {
    const { id } = req.params;
    const { programId, status } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.savedPrograms.push({
      programId,
      status: status || "active",
    });

    const updatedUser = await user.save();
    res.json(updatedUser);
  } catch (error) {
    console.error("Error adding saved program:", error);
    res.status(400).json({ message: "Failed to add saved program", error: error.message });
  }
});

// Return detailed programInfo documents (days / exercises / sets)
app.get("/programsinfos", async (req, res) => {
    const infoData = await ProgramInfoModel.find();
    res.json(infoData);
});

