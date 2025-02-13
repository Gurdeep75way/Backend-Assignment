import mongoose from "mongoose";

/**
 * Initializes the connection to the MongoDB database.
 * 
 * This function establishes a connection to the MongoDB database using the URI provided in the environment variable `MONGO_URI`.
 * It returns a promise that resolves to `true` if the connection is successful, or it rejects with an error if the connection fails.
 * 
 * @async
 * @function initDB
 * @returns {Promise<boolean>} A promise that resolves to `true` if the database is connected successfully, or it rejects with an error.
 * @throws {Error} If the MongoDB URI is not found in the environment variables.
 */
export const initDB = async (): Promise<boolean> => {
  return await new Promise((resolve, reject) => {
    const mongodbUri = process.env.MONGO_URI ?? "";

    if (mongodbUri === "") throw new Error("MongoDB URI not found!");

    // Set MongoDB connection options
    mongoose.set("strictQuery", false);

    mongoose
      .connect(mongodbUri)
      .then(() => {
        console.log("DB Connected!");
        resolve(true);
      })
      .catch(reject);
  });
};
