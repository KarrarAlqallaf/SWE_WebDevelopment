import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const router = express.Router();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route for home page "/"
router.get("/", (req, res) => {
    // In production, serve the built React app's index.html
    // For now, this is a placeholder that can be updated to serve static files
    res.json({ 
        message: "Home page route",
        path: "/"
    });
});

// Route for registration page "/registration"
router.get("/registration", (req, res) => {
    // In production, serve the built React app's index.html
    // React Router will handle the client-side routing
    res.json({ 
        message: "Registration page route",
        path: "/registration"
    });
});

// Route for admin dashboard "/adminDashboard"
router.get("/adminDashboard", (req, res) => {
    // In production, serve the built React app's index.html
    // React Router will handle the client-side routing
    res.json({ 
        message: "Admin dashboard page route",
        path: "/adminDashboard"
    });
});

export default router;

