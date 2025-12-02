import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });
};

/**
 * User Signup Controller
 */
export const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Check if user already exists
        const existingUser = await UserModel.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? "Email already registered"
                    : "Username already taken",
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = new UserModel({
            email,
            username,
            password: hashedPassword,
            role: "user", // Default role for signups
        });

        const savedUser = await newUser.save();

        // Generate token
        const token = generateToken(savedUser._id);

        // Return user data (excluding password) and token
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                user: {
                    id: savedUser._id,
                    username: savedUser.username,
                    email: savedUser.email,
                    role: savedUser.role,
                    joinedAt: savedUser.joinedAt,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to register user",
            error: error.message,
        });
    }
};

/**
 * User Login Controller
 */
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username (include password for comparison)
        const user = await UserModel.findOne({ username }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return user data (excluding password) and token
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    joinedAt: user.joinedAt,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Login failed",
            error: error.message,
        });
    }
};

/**
 * Admin Login Controller
 */
export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username (include password for comparison)
        const user = await UserModel.findOne({ username }).select("+password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Check if user is admin
        if (user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Return admin user data (excluding password) and token
        res.status(200).json({
            success: true,
            message: "Admin login successful",
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role,
                    joinedAt: user.joinedAt,
                },
                token,
            },
        });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({
            success: false,
            message: "Admin login failed",
            error: error.message,
        });
    }
};

/**
 * Get current user profile (protected route)
 */
export const getCurrentUser = async (req, res) => {
    try {
        // User is attached to req by authenticateToken middleware
        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: req.user._id,
                    username: req.user.username,
                    email: req.user.email,
                    role: req.user.role,
                    joinedAt: req.user.joinedAt,
                    createdProgramCount: req.user.createdProgramCount,
                },
            },
        });
    } catch (error) {
        console.error("Get current user error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get user profile",
            error: error.message,
        });
    }
};

