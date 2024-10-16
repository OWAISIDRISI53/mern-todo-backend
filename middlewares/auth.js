import jwt from "jsonwebtoken";


const authenticateUser = (req, res, next) => {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    // Check if the authorization header is present
    if (!authHeader) {
        return res.status(401).send({ error: "Access Denied. No token provided." });
    }

    // Split the header to get the token
    const token = authHeader.split(' ')[1];

    // Check if the token exists
    if (!token) {
        return res.status(401).send({ error: "Access Denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decoded;
        next(); // Call the next middleware or route handler
    } catch (err) {
        // Handle invalid or expired token
        console.log(err);

        res.status(403).send({ error: "Invalid or expired token" });
    }
};

export default authenticateUser;

