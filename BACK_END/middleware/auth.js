// middleware/auth.js
import jwt from "jsonwebtoken";

export function verifyAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing or invalid token" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user payload for downstream
    next();
  } catch (err) {
    console.error("JWT error:", err.message);
    res.status(401).json({ error: "Unauthorized" });
  }
}
