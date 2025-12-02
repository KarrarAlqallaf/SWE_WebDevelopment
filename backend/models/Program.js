import mongoose from "mongoose";

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

const ProgramModel = mongoose.model("programs", programSchema);

// ProgramInfoModel uses the same schema but different collection name
const ProgramInfoModel = mongoose.models.programsInfo || mongoose.model("programsInfo", programSchema);

export default ProgramModel;
export { ProgramInfoModel };

