const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = "jwtSecretKey"


exports.authenticateUser = (req, res, next) => {
  // ✅ Middleware to authenticate users
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
// ✅ Middleware to authenticate organizers
exports.authenticateOrganizer = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.organizerId = decoded.organizerId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// ✅ Middleware to authenticate admin
exports.authenticateAdmin = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) return res.status(401).json({ error: "Access denied. No token provided." });
  token = token.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    if (decoded.role !== "admin") return res.status(403).json({ error: "Unauthorized" });

    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

