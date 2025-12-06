import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Update user profile (username, email, profile picture)
 */
export const updateProfile = async (req, res) => {
    try {
        const { username, email, profilePicture } = req.body;
        const userId = req.user._id;

        // Build update object
        const updateData = {};
        if (username !== undefined) {
            // Check if username is already taken by another user
            const existingUser = await UserModel.findOne({
                username,
                _id: { $ne: userId },
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Username already taken",
                });
            }
            updateData.username = username.trim();
        }
        if (email !== undefined) {
            // Validate email format
            const emailRegex = /^\S+@\S+\.\S+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please provide a valid email address",
                });
            }
            // Check if email is already taken by another user
            const existingUser = await UserModel.findOne({
                email: email.toLowerCase(),
                _id: { $ne: userId },
            });
            if (existingUser) {
                return res.status(400).json({
                    success: false,
                    message: "Email already registered",
                });
            }
            updateData.email = email.toLowerCase().trim();
        }
        if (profilePicture !== undefined) {
            updateData.profilePicture = profilePicture;
        }

        // Update user
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: {
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profilePicture: updatedUser.profilePicture,
                    joinedAt: updatedUser.joinedAt,
                },
            },
        });
    } catch (error) {
        console.error("Update profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update profile",
            error: error.message,
        });
    }
};

/**
 * Change user password
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user._id;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Current password and new password are required",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters long",
            });
        }

        // Get user with password
        const user = await UserModel.findById(userId).select("+password");

        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: "User does not have a password set",
            });
        }

        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Current password is incorrect",
            });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.error("Change password error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change password",
            error: error.message,
        });
    }
};

/**
 * Change user email
 */
export const changeEmail = async (req, res) => {
    try {
        const { newEmail, password } = req.body;
        const userId = req.user._id;

        if (!newEmail || !password) {
            return res.status(400).json({
                success: false,
                message: "New email and password are required",
            });
        }

        // Validate email format
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(newEmail)) {
            return res.status(400).json({
                success: false,
                message: "Please provide a valid email address",
            });
        }

        // Get user with password
        const user = await UserModel.findById(userId).select("+password");

        if (!user || !user.password) {
            return res.status(400).json({
                success: false,
                message: "User does not have a password set",
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        // Check if email is already taken
        const existingUser = await UserModel.findOne({
            email: newEmail.toLowerCase(),
            _id: { $ne: userId },
        });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Update email
        user.email = newEmail.toLowerCase().trim();
        await user.save();

        const updatedUser = await UserModel.findById(userId).select("-password");

        res.status(200).json({
            success: true,
            message: "Email changed successfully",
            data: {
                user: {
                    id: updatedUser._id,
                    username: updatedUser.username,
                    email: updatedUser.email,
                    role: updatedUser.role,
                    profilePicture: updatedUser.profilePicture,
                },
            },
        });
    } catch (error) {
        console.error("Change email error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to change email",
            error: error.message,
        });
    }
};

/**
 * Upload profile picture (base64 or URL)
 */
export const uploadProfileImage = async (req, res) => {
    try {
        const { imageData } = req.body; // Base64 string or URL
        const userId = req.user._id;

        if (!imageData) {
            return res.status(400).json({
                success: false,
                message: "Image data is required",
            });
        }

        // Update user profile picture
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { $set: { profilePicture: imageData } },
            { new: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile picture uploaded successfully",
            data: {
                profilePicture: updatedUser.profilePicture,
            },
        });
    } catch (error) {
        console.error("Upload profile image error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload profile picture",
            error: error.message,
        });
    }
};

/**
 * Add a program to user's saved programs
 */
export const addSavedProgram = async (req, res) => {
    try {
        const { id } = req.params; // User ID from route
        const { programId, status } = req.body;
        const userId = req.user._id; // Authenticated user ID

        // Verify that the authenticated user matches the route parameter
        if (String(userId) !== String(id)) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own saved programs",
            });
        }

        if (!programId) {
            return res.status(400).json({
                success: false,
                message: "Program ID is required",
            });
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if program is already saved
        const existingSavedProgram = user.savedPrograms.find(
            (sp) => String(sp.programId) === String(programId)
        );

        if (existingSavedProgram) {
            // Update status if different
            if (status && existingSavedProgram.status !== status) {
                existingSavedProgram.status = status;
                await user.save();
            }
            return res.status(200).json({
                success: true,
                message: "Program already saved",
                data: {
                    user: {
                        id: user._id,
                        savedPrograms: user.savedPrograms,
                    },
                },
            });
        }

        // Add new saved program
        user.savedPrograms.push({
            programId,
            status: status || "active",
        });

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Program added to vault successfully",
            data: {
                user: {
                    id: updatedUser._id,
                    savedPrograms: updatedUser.savedPrograms,
                },
            },
        });
    } catch (error) {
        console.error("Add saved program error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to add program to vault",
            error: error.message,
        });
    }
};

/**
 * Remove a program from user's saved programs
 */
export const removeSavedProgram = async (req, res) => {
    try {
        const { id } = req.params; // User ID from route
        const { savedProgramId } = req.params; // Saved program ID from route
        const userId = req.user._id; // Authenticated user ID

        // Verify that the authenticated user matches the route parameter
        if (String(userId) !== String(id)) {
            return res.status(403).json({
                success: false,
                message: "You can only modify your own saved programs",
            });
        }

        // Find user
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // Remove the saved program from the array
        user.savedPrograms = user.savedPrograms.filter(
            (sp) => String(sp._id) !== String(savedProgramId)
        );

        const updatedUser = await user.save();

        res.status(200).json({
            success: true,
            message: "Program removed from vault successfully",
            data: {
                user: {
                    id: updatedUser._id,
                    savedPrograms: updatedUser.savedPrograms,
                },
            },
        });
    } catch (error) {
        console.error("Remove saved program error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove program from vault",
            error: error.message,
        });
    }
};

