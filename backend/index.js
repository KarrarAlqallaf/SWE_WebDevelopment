import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

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

// ============================================
// CORRECT ORDER FOR YOUR index.js
// ============================================

// 1. FIRST: Define your schemas

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["guest", "user", "admin"],
    default: "guest",
  },
  savedPrograms: [
    {
      programId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "programs",
      },
      savedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        default: "active",
      },
    },
  ],
  createdProgramCount: {
    type: Number,
    default: 0,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
});

// Helper function to validate and convert IDs to integers
const validateIntegerId = function (value) {
  if (typeof value === 'number') {
    return Math.floor(value);
  }
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed)) return parsed;
  }
  return value;
};

const setSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      set: validateIntegerId,
      validate: {
        validator: Number.isInteger,
        message: 'Set ID must be an integer'
      }
    },
    weight: { type: String, default: "" },
    reps: { type: String, default: "" },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      set: validateIntegerId,
      validate: {
        validator: Number.isInteger,
        message: 'Exercise ID must be an integer'
      }
    },
    name: { type: String, required: true },
    muscle: { type: String, required: true },
    unit: { type: String, default: "KG" },
    sets: { type: [setSchema], default: [] },
    notes: { type: String, default: "" },
  },
  { _id: false }
);

const daySchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: true,
      set: validateIntegerId,
      validate: {
        validator: Number.isInteger,
        message: 'Day ID must be an integer'
      }
    },
    exercises: { type: [exerciseSchema], default: [] },
  },
  { _id: false }
);

const programInfoSchema = new mongoose.Schema(
  {
    days: { type: [daySchema], default: [] },
  },
  { _id: false }
);

const programSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    shortLabel: {
      type: String,
    },
    summary: {
      type: String,
    },
    description: {
      type: String,
    },
    tags: [
      {
        type: String,
      },
    ],
    durationHint: {
      type: String,
    },
    type: {
      type: String,
      enum: ["system", "community"],
      default: "community",
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      default: null,
    },
    authorName: {
      type: String,
    },
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    programInfo: {
      type: programInfoSchema,
      default: () => ({ days: [] }),
    },
  },
  {
    timestamps: true,
  }
);

// 2. SECOND: Add middleware to the schema (AFTER schema is defined)
programSchema.pre('save', async function () {
  if (this.programInfo && this.programInfo.days) {
    // Clean all IDs to ensure they're integers
    this.programInfo.days.forEach((day, dayIndex) => {
      day.id = Math.floor(day.id) || dayIndex + 1;

      if (day.exercises) {
        day.exercises.forEach((exercise, exIndex) => {
          exercise.id = Math.floor(exercise.id) || exIndex + 1;

          if (exercise.sets) {
            exercise.sets.forEach((set, setIndex) => {
              set.id = Math.floor(set.id) || setIndex + 1;
            });
          }
        });
      }
    });
  }
});

const categorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  type: {
    type: String,
    required: true,
  },
});

// 3. THIRD: Create models from schemas
const UserModel = mongoose.model("users", userSchema);
const ProgramModel = mongoose.model("programs", programSchema);
// const ProgramInfoModel = mongoose.model("programsInfo", programSchema);
const CategoryModel = mongoose.model("categories", categorySchema);

// 4. FOURTH: Define your routes (keep existing routes)
app.get("/", (req, res) => {
  res.send("Hello World");
});

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

// 5. UPDATED POST /programs route with ID normalization
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

// Keep all your other existing routes below...
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