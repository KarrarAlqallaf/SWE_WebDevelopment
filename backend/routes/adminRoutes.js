import express from "express";
import {
    banUser,
    unbanUser,
    deleteProgram,
    editProgram,
    createProgram,
    updateUserRole,
    getAllUsers,
    getAllPrograms,
} from "../controllers/adminController.js";
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// User management
router.get("/users", getAllUsers);
router.patch("/banUser/:id", banUser);
router.patch("/unbanUser/:id", unbanUser);
router.patch("/updateUserRole/:id", updateUserRole);

// Program management
router.get("/programs", getAllPrograms);
router.post("/createProgram", createProgram);
router.patch("/editProgram/:id", editProgram);
router.delete("/deleteProgram/:id", deleteProgram);

export default router;

