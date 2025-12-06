import express from "express";
import {
    updateProfile,
    changePassword,
    changeEmail,
    uploadProfileImage,
    addSavedProgram,
    removeSavedProgram,
} from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.patch("/updateProfile", authenticateToken, updateProfile);
router.patch("/changePassword", authenticateToken, changePassword);
router.patch("/changeEmail", authenticateToken, changeEmail);
router.post("/uploadProfileImage", authenticateToken, uploadProfileImage);
router.post("/:id/saved-programs", authenticateToken, addSavedProgram);
router.delete("/:id/saved-programs/:savedProgramId", authenticateToken, removeSavedProgram);

export default router;

