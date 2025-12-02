import jwt from "jsonwebtoken";
import UserModel from "../models/User.js";

/**
 * Middleware to verify JWT token and attach user to request
 */
export const authenticateToken = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Access token is required",
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Get user from database (excluding password)
        const user = await UserModel.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        // Attach user to request object
        req.user = user;
        next();
    } catch (error) {
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                success: false,
                message: "Invalid token",
            });
        }
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                success: false,
                message: "Token has expired",
            });
        }
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
        return res.status(401).json({
            success: false,
            message: "Authentication required",
        });
    }

    if (req.user.role !== "admin") {
        return res.status(403).json({
            success: false,
            message: "Admin access required",
        });
    }

    next();
};

