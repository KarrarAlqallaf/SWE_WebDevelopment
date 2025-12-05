import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET;


/**
 * Generate JWT token
 */
const generateToken = (userId) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error("[AUTH ERROR] JWT_SECRET is not defined in environment variables");
            throw new Error("JWT_SECRET is not configured");
        }
        return jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });
    } catch (error) {
        console.error("[AUTH ERROR] Failed to generate JWT token:", error.message);
        throw error;
    }
};

/**
 * User Signup Controller
 */
export const signup = async (req, res) => {
    try {
        const { email, username, password } = req.body;

        console.log("[SIGNUP] Attempting to register user:", { email, username });

        // Check if user already exists
        let existingUser;
        try {
            existingUser = await UserModel.findOne({
                $or: [{ email }, { username }],
            });
        } catch (dbError) {
            console.error("[SIGNUP ERROR] Database query failed while checking existing user:", {
                error: dbError.message,
                stack: dbError.stack,
            });
            throw new Error("Database connection error");
        }

        if (existingUser) {
            const conflictType = existingUser.email === email ? "email" : "username";
            console.warn(`[SIGNUP WARNING] ${conflictType} already exists:`, {
                email: existingUser.email === email ? email : "N/A",
                username: existingUser.username === username ? username : "N/A",
            });
            return res.status(400).json({
                success: false,
                message: existingUser.email === email
                    ? "Email already registered"
                    : "Username already taken",
            });
        }

        // Hash password
        let hashedPassword;
        try {
            const saltRounds = 10;
            hashedPassword = await bcrypt.hash(password, saltRounds);
            console.log("[SIGNUP] Password hashed successfully");
        } catch (hashError) {
            console.error("[SIGNUP ERROR] Password hashing failed:", {
                error: hashError.message,
                stack: hashError.stack,
            });
            throw new Error("Failed to process password");
        }

        // Create new user
        const newUser = new UserModel({
            email,
            username,
            password: hashedPassword,
            role: "user", // Default role for signups
        });

        let savedUser;
        try {
            savedUser = await newUser.save();
            console.log("[SIGNUP SUCCESS] User created successfully:", {
                userId: savedUser._id,
                username: savedUser.username,
                email: savedUser.email,
            });
        } catch (saveError) {
            console.error("[SIGNUP ERROR] Failed to save user to database:", {
                error: saveError.message,
                code: saveError.code,
                keyPattern: saveError.keyPattern,
                keyValue: saveError.keyValue,
                stack: saveError.stack,
            });
            throw saveError;
        }

        // Generate token
        let token;
        try {
            token = generateToken(savedUser._id);
            console.log("[SIGNUP] JWT token generated successfully");
        } catch (tokenError) {
            console.error("[SIGNUP ERROR] Token generation failed:", {
                error: tokenError.message,
                userId: savedUser._id,
            });
            throw new Error("Failed to generate authentication token");
        }

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
        console.error("[SIGNUP ERROR] Signup process failed:", {
            error: error.message,
            stack: error.stack,
            name: error.name,
        });
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

        console.log("[LOGIN] Attempting login for username:", username);

        // Find user by username (include password for comparison)
        let user;
        try {
            user = await UserModel.findOne({ username }).select("+password");
        } catch (dbError) {
            console.error("[LOGIN ERROR] Database query failed while finding user:", {
                error: dbError.message,
                username,
                stack: dbError.stack,
            });
            throw new Error("Database connection error");
        }

        if (!user) {
            console.warn("[LOGIN WARNING] User not found:", { username });
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Check if user is banned
        if (user.isBanned) {
            console.warn("[LOGIN WARNING] Attempted login by banned user:", {
                userId: user._id,
                username: user.username,
            });
            return res.status(403).json({
                success: false,
                message: "Account has been banned",
            });
        }

        // Check password
        let isPasswordValid;
        try {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } catch (compareError) {
            console.error("[LOGIN ERROR] Password comparison failed:", {
                error: compareError.message,
                userId: user._id,
                stack: compareError.stack,
            });
            throw new Error("Password verification error");
        }

        if (!isPasswordValid) {
            console.warn("[LOGIN WARNING] Invalid password attempt:", {
                userId: user._id,
                username: user.username,
            });
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token
        let token;
        try {
            token = generateToken(user._id);
            console.log("[LOGIN SUCCESS] User logged in successfully:", {
                userId: user._id,
                username: user.username,
                role: user.role,
            });
        } catch (tokenError) {
            console.error("[LOGIN ERROR] Token generation failed:", {
                error: tokenError.message,
                userId: user._id,
            });
            throw new Error("Failed to generate authentication token");
        }

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
        console.error("[LOGIN ERROR] Login process failed:", {
            error: error.message,
            stack: error.stack,
            name: error.name,
        });
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

        console.log("[ADMIN LOGIN] Attempting admin login for username:", username);

        // Find user by username (include password for comparison)
        let user;
        try {
            user = await UserModel.findOne({ username }).select("+password");
        } catch (dbError) {
            console.error("[ADMIN LOGIN ERROR] Database query failed while finding user:", {
                error: dbError.message,
                username,
                stack: dbError.stack,
            });
            throw new Error("Database connection error");
        }

        if (!user) {
            console.warn("[ADMIN LOGIN WARNING] User not found:", { username });
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Check if user is admin
        if (user.role !== "admin") {
            console.warn("[ADMIN LOGIN WARNING] Non-admin user attempted admin login:", {
                userId: user._id,
                username: user.username,
                role: user.role,
            });
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required.",
            });
        }

        // Check if user is banned
        if (user.isBanned) {
            console.warn("[ADMIN LOGIN WARNING] Attempted login by banned admin user:", {
                userId: user._id,
                username: user.username,
            });
            return res.status(403).json({
                success: false,
                message: "Account has been banned",
            });
        }

        // Check password
        let isPasswordValid;
        try {
            isPasswordValid = await bcrypt.compare(password, user.password);
        } catch (compareError) {
            console.error("[ADMIN LOGIN ERROR] Password comparison failed:", {
                error: compareError.message,
                userId: user._id,
                stack: compareError.stack,
            });
            throw new Error("Password verification error");
        }

        if (!isPasswordValid) {
            console.warn("[ADMIN LOGIN WARNING] Invalid password attempt for admin:", {
                userId: user._id,
                username: user.username,
            });
            return res.status(401).json({
                success: false,
                message: "Invalid username or password",
            });
        }

        // Generate token
        let token;
        try {
            token = generateToken(user._id);
            console.log("[ADMIN LOGIN SUCCESS] Admin logged in successfully:", {
                userId: user._id,
                username: user.username,
                email: user.email,
            });
        } catch (tokenError) {
            console.error("[ADMIN LOGIN ERROR] Token generation failed:", {
                error: tokenError.message,
                userId: user._id,
            });
            throw new Error("Failed to generate authentication token");
        }

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
        console.error("[ADMIN LOGIN ERROR] Admin login process failed:", {
            error: error.message,
            stack: error.stack,
            name: error.name,
        });
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
        if (!req.user) {
            console.error("[GET CURRENT USER ERROR] User object not found in request");
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        console.log("[GET CURRENT USER] Fetching profile for user:", {
            userId: req.user._id,
            username: req.user.username,
        });

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
        console.error("[GET CURRENT USER ERROR] Failed to get user profile:", {
            error: error.message,
            stack: error.stack,
            userId: req.user?._id,
        });
        res.status(500).json({
            success: false,
            message: "Failed to get user profile",
            error: error.message,
        });
    }
};

