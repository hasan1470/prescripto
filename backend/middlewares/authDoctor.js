import { requireRole } from "../lib/auth.js";

export default requireRole("doctor", "dtoken", "docId");
