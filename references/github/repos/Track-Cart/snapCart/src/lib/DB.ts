import mongoose from "mongoose";
const mongsDbUrl = process.env.MONGODB_URL;

if (!mongsDbUrl) {
  throw new Error("Db error");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(mongsDbUrl).then((m) => m.connection);
  }
  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    cached.promise = null;
    throw error;
  }
};

export default connectDb;
