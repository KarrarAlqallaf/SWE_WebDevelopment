import mongoose from "mongoose";
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long"],
        maxlength: [30, "Username cannot exceed 30 characters"],
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    password: {
        type: String,
        required: false, // Optional for backward compatibility with existing users
        minlength: [6, "Password must be at least 6 characters long"],
        select: false, // Don't return password by default in queries
    },
    role: {
        type: String,
        enum: ["guest", "user", "admin"],
        default: "user",
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
    profilePicture: {
        type: String,
        default: null, // URL or base64 string
    },
    isBanned: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

const UserModel = mongoose.model("users", userSchema);

export default UserModel;

