import mongoose from "mongoose";
let connection;
export default async function connectDB() {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!process.env.MONGODB_URL) throw new Error("Database is not configured");
  if (!connection) connection = mongoose.connect(process.env.MONGODB_URL, {
    dbName: "prescripto", serverSelectionTimeoutMS: 10000,
  }).catch(error => { connection = undefined; throw error; });
  return connection;
}
