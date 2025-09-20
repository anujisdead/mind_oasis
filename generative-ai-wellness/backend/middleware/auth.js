const jwt = require("jsonwebtoken");

/**
 * Authentication middleware for protected routes.
 * Checks for JWT in Authorization header: "Bearer <token>"
 */
module.exports = function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1]; // after "Bearer "
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // verify token with your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach decoded user info to request
    req.user = {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email
    };

    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};
