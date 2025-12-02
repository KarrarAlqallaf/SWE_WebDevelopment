/**
 * Input validation middleware for authentication routes
 */

export const validateSignup = (req, res, next) => {
    const { email, username, password } = req.body;

    // Check if all required fields are present
    if (!email || !username || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required (email, username, password)",
        });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address",
        });
    }

    // Validate username length
    if (username.trim().length < 3 || username.trim().length > 30) {
        return res.status(400).json({
            success: false,
            message: "Username must be between 3 and 30 characters",
        });
    }

    // Validate password length
    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long",
        });
    }

    next();
};

export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    next();
};

export const validateAdminLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    next();
};

