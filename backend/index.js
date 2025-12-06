import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import jwt from "jsonwebtoken";
import UserModel from "./models/User.js";
import ProgramModel, { ProgramInfoModel } from "./models/Program.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();
dotenv.config();

const PORT = process.env.PORT;
const MONGO_URL = process.env.MONGO_URL;
const JWT_SECRET = process.env.JWT_SECRET;

// Validate environment variables
if (!MONGO_URL) {
    console.error("[STARTUP ERROR] MONGO_URL is not defined in environment variables");
    console.error("[STARTUP ERROR] Please set MONGO_URL in your .env file");
    process.exit(1);
}

if (!PORT) {
    console.warn("[STARTUP WARNING] PORT is not defined, defaulting to 8000");
}

if (!process.env.JWT_SECRET) {
    console.error("[STARTUP ERROR] JWT_SECRET is not defined in environment variables");
    console.error("[STARTUP ERROR] Authentication will fail without JWT_SECRET");
}

// Middleware
app.use(cors());
app.use(express.json());

// Database connection with detailed error handling
console.log("[STARTUP] Attempting to connect to MongoDB...");
mongoose
  .connect(MONGO_URL)
  .then(() => {
    console.log("[STARTUP SUCCESS] MongoDB connected successfully");
    app.listen(PORT || 8000, () => {
      console.log(
        `[STARTUP SUCCESS] Database Connected and Server is running on port ${PORT || 8000}`
      );
    });
  })
  .catch((err) => {
    console.error("[STARTUP ERROR] MongoDB connection failed:", {
      error: err.message,
      name: err.name,
      code: err.code,
      stack: err.stack,
    });
    console.error("[STARTUP ERROR] Please check your MONGO_URL in .env file");
    console.error("[STARTUP ERROR] Server will not start without database connection");
    process.exit(1);
  });

// Handle MongoDB connection events
mongoose.connection.on("error", (err) => {
    console.error("[MONGO ERROR] MongoDB connection error:", {
        error: err.message,
        stack: err.stack,
    });
});

mongoose.connection.on("disconnected", () => {
    console.warn("[MONGO WARNING] MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
    console.log("[MONGO SUCCESS] MongoDB reconnected");
});


// Category Schema (defined here as it's only used in index.js)
const categorySchema = new mongoose.Schema({
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

// Create CategoryModel (UserModel and ProgramModel are imported from their respective files)
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
    try {
        // Get user ID from token if authenticated (optional)
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        let userId = null;

        if (token && process.env.JWT_SECRET) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId ? new mongoose.Types.ObjectId(decoded.userId) : null;
            } catch (err) {
                // Invalid or expired token - treat as unauthenticated
                userId = null;
            }
        }

        // Build query filter based on visibility rules:
        // 1. Public programs (isPublic: true) - visible to everyone
        // 2. Private programs (isPublic: false) - only visible to author
        const query = {
            $or: [
                { isPublic: true },
                ...(userId ? [{ isPublic: false, authorId: userId }] : [])
            ]
        };

        console.log("[GET PROGRAMS] Fetching programs with filter:", {
            userId: userId ? userId.toString() : "none (unauthenticated)",
            query: JSON.stringify(query)
        });

        const programData = await ProgramModel.find(query);
        
        console.log("[GET PROGRAMS] Returning", programData.length, "programs");
        res.json(programData);
    } catch (error) {
        console.error("[GET PROGRAMS ERROR] Failed to fetch programs:", error);
        res.status(500).json({ 
            error: "Failed to fetch programs",
            message: error.message 
        });
    }
});

app.get("/getCategories", async (req, res) => {
    const categoryData = await CategoryModel.find();
    res.json(categoryData);
});

// Get a single program by ID (shareable link - public access)
app.get("/programs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        
        // Validate ID format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                error: "Invalid program ID",
                message: "The provided program ID is not valid"
            });
        }

        // Get user ID from token if authenticated (optional)
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];
        let userId = null;

        if (token && process.env.JWT_SECRET) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.userId ? new mongoose.Types.ObjectId(decoded.userId) : null;
            } catch (err) {
                // Invalid or expired token - treat as unauthenticated
                userId = null;
            }
        }

        // Find program by ID
        const program = await ProgramModel.findById(id);

        if (!program) {
            return res.status(404).json({
                error: "Program not found",
                message: "The requested program does not exist"
            });
        }

        // Check visibility rules:
        // 1. Public programs (isPublic: true) - visible to everyone
        // 2. Private programs (isPublic: false) - only visible to author
        if (!program.isPublic && (!userId || String(program.authorId) !== String(userId))) {
            return res.status(403).json({
                error: "Access denied",
                message: "This program is private and you don't have permission to view it"
            });
        }

        console.log("[GET PROGRAM BY ID] Returning program:", {
            programId: id,
            title: program.title,
            isPublic: program.isPublic,
            userId: userId ? userId.toString() : "none (unauthenticated)"
        });

        res.json(program);
    } catch (error) {
        console.error("[GET PROGRAM BY ID ERROR] Failed to fetch program:", error);
        res.status(500).json({
            error: "Failed to fetch program",
            message: error.message
        });
    }
});

// ================================
// POST routes (create / update)
// ================================

// POST /programs route with ID normalization
app.post("/programs", async (req, res) => {
  try {
    console.log("=== Received POST /programs ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));

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

    // Log the programInfo structure
    console.log("programInfo received:", JSON.stringify(programInfo, null, 2));

    // Normalize all IDs in programInfo to integers
    const normalizedProgramInfo = programInfo ? {
      days: (programInfo.days || []).map((day, dayIndex) => ({
        id: Math.floor(day.id) || dayIndex + 1,
        exercises: (day.exercises || []).map((exercise, exIndex) => ({
          id: Math.floor(exercise.id) || exIndex + 1,
          name: exercise.name,
          muscle: exercise.muscle,
          unit: exercise.unit || "KG",
          sets: (exercise.sets || []).map((set, setIndex) => ({
            id: Math.floor(set.id) || setIndex + 1,
            weight: set.weight || "",
            reps: set.reps || "",
          })),
          notes: exercise.notes || "",
        })),
      })),
    } : { days: [] };

    console.log("Normalized programInfo:", JSON.stringify(normalizedProgramInfo, null, 2));

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
      programInfo: normalizedProgramInfo,
    });

    console.log("About to save program...");
    const savedProgram = await program.save();
    console.log("Program saved successfully:", savedProgram._id);

    res.status(201).json(savedProgram);
  } catch (error) {
    console.error("=== ERROR in POST /programs ===");
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Full error:", error);

    // If it's a validation error, log the details
    if (error.name === 'ValidationError') {
      console.error("Validation errors:", error.errors);
    }

    res.status(400).json({
      message: "Failed to create program",
      error: error.message,
      details: error.name === 'ValidationError' ? error.errors : undefined
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const user = new UserModel({ username, email, role });
    const savedUser = await user.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(400).json({ message: "Failed to create user", error: error.message });
  }
});

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

app.post("/categories", async (req, res) => {
  try {
    const { label, slug, type } = req.body;
    const category = new CategoryModel({ label, slug, type });
    const savedCategory = await category.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(400).json({ message: "Failed to create category", error: error.message });
  }
});


// POST /programs/:id/rating - Update program rating
app.post("/programs/:id/rating", async (req, res) => {
  try {
    const { id } = req.params;
    const { rating } = req.body;

    // Get user ID from token
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    let userId = null;

    if (!token || !process.env.JWT_SECRET) {
      return res.status(401).json({ message: "Authentication required to rate programs" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      userId = decoded.userId ? new mongoose.Types.ObjectId(decoded.userId) : null;
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    if (!userId) {
      return res.status(401).json({ message: "User ID not found in token" });
    }

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    // Find the program
    const program = await ProgramModel.findById(id);
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Initialize ratings array if it doesn't exist
    if (!program.ratings) {
      program.ratings = [];
    }

    // Check if user already rated this program
    const existingRatingIndex = program.ratings.findIndex(
      (r) => String(r.userId) === String(userId)
    );

    if (existingRatingIndex >= 0) {
      // Update existing rating
      program.ratings[existingRatingIndex].rating = rating;
      program.ratings[existingRatingIndex].ratedAt = new Date();
    } else {
      // Add new rating
      program.ratings.push({
        userId: userId,
        rating: rating,
        ratedAt: new Date(),
      });
    }

    // Calculate average rating and count
    const totalRating = program.ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = program.ratings.length > 0 ? totalRating / program.ratings.length : 0;
    const ratingCount = program.ratings.length;

    // Update program with new rating data
    program.rating = Math.round(averageRating * 10) / 10; // Round to 1 decimal place
    program.ratingCount = ratingCount;

    await program.save();

    res.json(program);
  } catch (error) {
    console.error("Error updating program rating:", error);
    res.status(400).json({ message: "Failed to update program rating", error: error.message });
  }
});