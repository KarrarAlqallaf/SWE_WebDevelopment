import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            console.warn("[AUTH MIDDLEWARE WARNING] Missing authorization token:", {
                path: req.path,
                method: req.method,
                hasAuthHeader: !!authHeader,
            });
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        // Check if JWT_SECRET is configured
        if (!process.env.JWT_SECRET) {
            console.error("[AUTH MIDDLEWARE ERROR] JWT_SECRET is not defined in environment variables");
            return res.status(500).json({
                success: false,
                message: "Server configuration error",
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (verifyError) {
            if (verifyError.name === "JsonWebTokenError") {
                console.warn("[AUTH MIDDLEWARE WARNING] Invalid JWT token:", {
                    error: verifyError.message,
                    path: req.path,
                });
                return res.status(401).json({
                    success: false,
                    message: "Invalid token",
                });
            }
            if (verifyError.name === "TokenExpiredError") {
                console.warn("[AUTH MIDDLEWARE WARNING] Expired JWT token:", {
                    expiredAt: verifyError.expiredAt,
                    path: req.path,
                });
                return res.status(401).json({
                    success: false,
                    message: "Token has expired",
                });
            }
            console.error("[AUTH MIDDLEWARE ERROR] Token verification failed:", {
                error: verifyError.message,
                name: verifyError.name,
                stack: verifyError.stack,
            });
            throw verifyError;
        }

        // Get user from database (excluding password)
        let user;
        try {
            user = await UserModel.findById(decoded.userId).select("-password");
        } catch (dbError) {
            console.error("[AUTH MIDDLEWARE ERROR] Database query failed while fetching user:", {
                error: dbError.message,
                userId: decoded.userId,
                stack: dbError.stack,
            });
            return res.status(500).json({
                success: false,
                message: "Database error",
                error: "Failed to verify user",
            });
        }

        if (!user) {
            console.warn("[AUTH MIDDLEWARE WARNING] User not found in database:", {
                userId: decoded.userId,
                path: req.path,
            });
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Check if user is banned
        if (user.isBanned) {
            console.warn("[AUTH MIDDLEWARE WARNING] Banned user attempted to access protected route:", {
                userId: user._id,
                username: user.username,
                path: req.path,
            });
            return res.status(403).json({
                success: false,
                message: "Account has been banned",
            });
        }

        // Attach user to request object
        req.user = user;
        console.log("[AUTH MIDDLEWARE] User authenticated successfully:", {
            userId: user._id,
            username: user.username,
            role: user.role,
            path: req.path,
        });
        next();
    } catch (error) {
        console.error("[AUTH MIDDLEWARE ERROR] Authentication middleware failed:", {
            error: error.message,
            name: error.name,
            stack: error.stack,
            path: req.path,
        });
        return res.status(500).json({
            success: false,
            message: "Authentication error",
            error: error.message,
        });
    }
};

/**
 * Middleware to check if user has admin role
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        console.warn("[REQUIRE ADMIN WARNING] No user object found in request:", {
            path: req.path,
            method: req.method,
        });
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    if (req.user.role !== "admin") {
        console.warn("[REQUIRE ADMIN WARNING] Non-admin user attempted to access admin route:", {
            userId: req.user._id,
            username: req.user.username,
            role: req.user.role,
            path: req.path,
        });
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    console.log("[REQUIRE ADMIN] Admin access granted:", {
        userId: req.user._id,
        username: req.user.username,
        path: req.path,
    });
    next();
};

