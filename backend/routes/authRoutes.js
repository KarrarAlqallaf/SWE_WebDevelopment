import express from "express";
import {
    signup,
    login,
    adminLogin,
    getCurrentUser,
    logout,
} from "../controllers/authController.js";
import {
    validateSignup,
    validateLogin,
    validateAdminLogin,
} from "../middleware/validationMiddleware.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/signup", validateSignup, signup);
router.post("/login", validateLogin, login);
router.post("/admin/login", validateAdminLogin, adminLogin);

// Protected routes (requires authentication)
router.get("/me", authenticateToken, getCurrentUser);
router.post("/logout", authenticateToken, logout);

export default router;

