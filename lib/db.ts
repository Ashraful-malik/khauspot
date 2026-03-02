import mongoose from "mongoose";

const globalForMongoose = global as typeof globalThis & {
  mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
};

let isConnected = false;
let cached = globalForMongoose.mongoose;

if (!cached) {
  cached = globalForMongoose.mongoose = { conn: null, promise: null };
}

const connectDb = async () => {
  const mongodbUrl = process.env.mongodbUrl!;
  const dbName = "teastallsnearme";

  if (!mongodbUrl) {
    throw new Error("mongodbUrl environment variable is not defined");
  }
  if (!dbName) {
    throw new Error("Db name environment variable is not defined");
  }
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(mongodbUrl, {
        dbName: dbName,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 10000,
      })
      .then((mongooseInstance) => {
        isConnected = true;

        mongoose.connection.on("connected", () => {
          console.log("Connected to MongoDB");
        });
        mongoose.connection.on("error", (err) => {
          console.log("MongoDB connection error", err);
        });
        mongoose.connection.on("disconnected", () => {
          console.log("MongoDB disconnected");
        });
        return mongooseInstance;
      })
      .catch((err) => {
        throw err;
      });
    cached.conn = await cached.promise;
    return cached.conn;
  }
};
export default connectDb;
