import UserModel from "../models/User.js";
import ProgramModel from "../models/Program.js";

/**
 * Ban a user
 */
export const banUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findByIdAndUpdate(
            id,
            { $set: { isBanned: true } },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User banned successfully",
            data: { user },
        });
    } catch (error) {
        console.error("Ban user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to ban user",
            error: error.message,
        });
    }
};

/**
 * Unban a user
 */
export const unbanUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await UserModel.findByIdAndUpdate(
            id,
            { $set: { isBanned: false } },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User unbanned successfully",
            data: { user },
        });
    } catch (error) {
        console.error("Unban user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to unban user",
            error: error.message,
        });
    }
};

/**
 * Delete a program
 */
export const deleteProgram = async (req, res) => {
    try {
        const { id } = req.params;

        const program = await ProgramModel.findByIdAndDelete(id);

        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Program deleted successfully",
        });
    } catch (error) {
        console.error("Delete program error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete program",
            error: error.message,
        });
    }
};

/**
 * Edit/Update a program
 */
export const editProgram = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const program = await ProgramModel.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!program) {
            return res.status(404).json({
                success: false,
                message: "Program not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Program updated successfully",
            data: { program },
        });
    } catch (error) {
        console.error("Edit program error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update program",
            error: error.message,
        });
    }
};

/**
 * Create a new program
 */
export const createProgram = async (req, res) => {
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

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Title is required",
            });
        }

        const program = new ProgramModel({
            title,
            shortLabel,
            summary,
            description,
            tags,
            durationHint,
            type: type || "community",
            isPublic: isPublic !== undefined ? isPublic : true,
            authorId: authorId || req.user._id,
            authorName: authorName || req.user.username,
            rating: rating || 0,
            ratingCount: ratingCount || 0,
            programInfo,
        });

        const savedProgram = await program.save();

        res.status(201).json({
            success: true,
            message: "Program created successfully",
            data: { program: savedProgram },
        });
    } catch (error) {
        console.error("Create program error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create program",
            error: error.message,
        });
    }
};

/**
 * Update user role
 */
export const updateUserRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;

        if (!role || !["guest", "user", "admin"].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Valid role is required (guest, user, admin)",
            });
        }

        const user = await UserModel.findByIdAndUpdate(
            id,
            { $set: { role } },
            { new: true }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User role updated successfully",
            data: { user },
        });
    } catch (error) {
        console.error("Update user role error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user role",
            error: error.message,
        });
    }
};

/**
 * Get all users (for admin dashboard)
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().select("-password").sort({ joinedAt: -1 });

        res.status(200).json({
            success: true,
            data: { users },
        });
    } catch (error) {
        console.error("Get all users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get users",
            error: error.message,
        });
    }
};

/**
 * Get all programs (for admin dashboard)
 */
export const getAllPrograms = async (req, res) => {
    try {
        const programs = await ProgramModel.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: { programs },
        });
    } catch (error) {
        console.error("Get all programs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get programs",
            error: error.message,
        });
    }
};

