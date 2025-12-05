/**
 * Input validation middleware for authentication routes
 */
const JWT_SECRET = process.env.JWT_SECRET;


export const validateSignup = (req, res, next) => {
    const { email, username, password } = req.body;

    // Check if all required fields are present
    if (!email || !username || !password) {
        const missingFields = [];
        if (!email) missingFields.push("email");
        if (!username) missingFields.push("username");
        if (!password) missingFields.push("password");

        console.warn("[VALIDATION WARNING] Signup validation failed - missing fields:", {
            missingFields,
            receivedFields: Object.keys(req.body),
        });
        return res.status(400).json({
            success: false,
            message: "All fields are required (email, username, password)",
        });
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        console.warn("[VALIDATION WARNING] Signup validation failed - invalid email format:", {
            email: email?.substring(0, 20) + "...", // Log partial email for security
        });
        return res.status(400).json({
            success: false,
            message: "Please provide a valid email address",
        });
    }

    // Validate username length
    if (username.trim().length < 3 || username.trim().length > 30) {
        console.warn("[VALIDATION WARNING] Signup validation failed - invalid username length:", {
            username,
            length: username?.trim().length,
        });
        return res.status(400).json({
            success: false,
            message: "Username must be between 3 and 30 characters",
        });
    }

    // Validate password length
    if (password.length < 6) {
        console.warn("[VALIDATION WARNING] Signup validation failed - password too short:", {
            passwordLength: password?.length,
        });
        return res.status(400).json({
            success: false,
            message: "Password must be at least 6 characters long",
        });
    }

    console.log("[VALIDATION] Signup validation passed:", { email, username });
    next();
};

export const validateLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        const missingFields = [];
        if (!username) missingFields.push("username");
        if (!password) missingFields.push("password");

        console.warn("[VALIDATION WARNING] Login validation failed - missing fields:", {
            missingFields,
            receivedFields: Object.keys(req.body),
        });
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    console.log("[VALIDATION] Login validation passed:", { username });
    next();
};

export const validateAdminLogin = (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        const missingFields = [];
        if (!username) missingFields.push("username");
        if (!password) missingFields.push("password");

        console.warn("[VALIDATION WARNING] Admin login validation failed - missing fields:", {
            missingFields,
            receivedFields: Object.keys(req.body),
        });
        return res.status(400).json({
            success: false,
            message: "Username and password are required",
        });
    }

    console.log("[VALIDATION] Admin login validation passed:", { username });
    next();
};

