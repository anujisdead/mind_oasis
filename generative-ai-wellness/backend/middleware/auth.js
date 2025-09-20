const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

module.exports = function(req, res, next) {
    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ error: "no token" });
  
    const token = authHeader.split(" ")[1]; // ✅ works with Bearer
    if (!token) return res.status(401).json({ error: "no token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "supersecret");
      req.userId = decoded.id;
      next();
    } catch (err) {
      return res.status(401).json({ error: "invalid token" });
    }
  }
  