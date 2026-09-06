import { requireRole } from "../lib/auth.js";

export default requireRole("admin", "atoken", null);



