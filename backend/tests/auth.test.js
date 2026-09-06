import test from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { issueToken, verifyToken, requireRole } from "../lib/auth.js";
process.env.JWT_SECRET = "local-regression-test-secret-not-a-deployment-key";

test("role tokens contain no password and expire", () => {
  const token = issueToken("admin", "administrator");
  const claims = jwt.decode(token);
  assert.equal(claims.role, "admin");
  assert.equal(claims.exp - claims.iat, 8 * 3600);
  assert.deepEqual(Object.keys(claims).sort(), ["aud","exp","iat","iss","role","sub"]);
  assert.equal(verifyToken(token,"admin"), "administrator");
});
test("a doctor token cannot authorize a patient or administrator", () => {
  const token = issueToken("doctor", "doctor-123");
  assert.throws(() => verifyToken(token, "user"));
  assert.throws(() => verifyToken(token, "admin"));
  assert.equal(verifyToken(token,"doctor"), "doctor-123");
});
test("expired and legacy tokens fail closed", () => {
  const expired = jwt.sign({role:"user"}, process.env.JWT_SECRET,{subject:"123",issuer:"prescripto",audience:"prescripto-app",expiresIn:-1});
  assert.throws(() => verifyToken(expired,"user"));
  assert.throws(() => verifyToken(jwt.sign({id:"123"},process.env.JWT_SECRET),"user"));
  let status;
  requireRole("user","token","userId")({headers:{}},{status(code){status=code;return this},json(body){assert.equal(body.success,false)}},()=>assert.fail("must not authorize"));
  assert.equal(status,401);
});
