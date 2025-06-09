import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/auth.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token faltante o inválido" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // ← lo podrás usar como req.user.id, etc.
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token inválido o expirado" });
  }
};
