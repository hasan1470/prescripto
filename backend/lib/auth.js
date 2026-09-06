import jwt from "jsonwebtoken";

const roles = new Set(["admin", "user", "doctor"]);
export function issueToken(role, subject) {
  if (!roles.has(role) || !subject) throw new Error("Invalid account role");
  return jwt.sign({ role }, process.env.JWT_SECRET, {
    algorithm: "HS256", subject: String(subject), expiresIn: role === "admin" ? "8h" : "7d",
    issuer: "prescripto", audience: "prescripto-app",
  });
}
export function verifyToken(token, role) {
  const claims = jwt.verify(token, process.env.JWT_SECRET, {
    algorithms: ["HS256"], issuer: "prescripto", audience: "prescripto-app",
  });
  if (claims.role !== role || typeof claims.sub !== "string" || !claims.sub || !claims.exp) throw new Error("Invalid account role");
  return claims.sub;
}
export function requireRole(role, header, property) {
  return (req, res, next) => {
    try {
      const subject = verifyToken(req.headers[header], role);
      if (property) req[property] = subject;
      next();
    } catch { return res.status(401).json({ success: false, message: "Your session has expired. Please sign in again." }); }
  };
}
