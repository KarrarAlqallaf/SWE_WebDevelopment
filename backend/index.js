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

const userSchema = new mongoose.Schema({
    // Mongoose will automatically create an _id of type ObjectId,
    // so you usually don't need to define _id manually.
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
    // "Vault" of saved programs (store references to another collection)
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
                default: "active", // e.g., active, completed, archived
            },
        },
    ],

    // Personal stats
    createdProgramCount: {
        type: Number,
        default: 0,
    },
    joinedAt: {
        type: Date,
        default: Date.now,
    },
});


// ============================================
// Program info module (days / exercises / sets)
// Matches the structure used in App.jsx templates
// ============================================

const setSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
    weight: { type: String, default: "" },
    reps: { type: String, default: "" },
  },
  { _id: false }
);

const exerciseSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true },
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
    id: { type: Number, required: true },
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
    // Mongoose will create _id automatically as ObjectId

    // Basic Metadata
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

    // Categorization
    tags: [
      {
        type: String,
      },
    ], // Array of strings
    durationHint: {
      type: String,
    },

    // Distinction Logic (Crucial for your data)
    type: {
      type: String,
      enum: ["system", "community"],
      default: "community",
    }, // 'system' (built-in), 'community' (user-generated)
    isPublic: {
      type: Boolean,
      default: true, // If false, only the author sees it
    },

    // Relationships
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users", // refers to UserModel collection
      default: null, // Null if it's a 'Built-in'
    },
    authorName: {
      type: String, // Cache the name to avoid extra lookups
    },

    // Stats
    rating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0, // To calculate averages
    },

    // Detailed program information (days / exercises / sets)
    programInfo: {
      type: programInfoSchema,
      default: () => ({ days: [] }),
    },
  },
  {
    // Timestamps
    timestamps: true, // automatically adds createdAt and updatedAt
  }
);

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
    

const UserModel = mongoose.model("users", userSchema);
const ProgramModel = mongoose.model("programs", programSchema);
const ProgramInfoModel = mongoose.model("programsInfo", programSchema);
const CategoryModel = mongoose.model("categories", categorySchema);

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

// Return detailed programInfo documents (days / exercises / sets)
app.get("/programsinfos", async (req, res) => {
    const infoData = await ProgramInfoModel.find();
    res.json(infoData);
});

