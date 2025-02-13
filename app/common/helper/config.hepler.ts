import dotenv from "dotenv";
import process from "process";
import path from "path";

/**
 * Loads the environment configuration based on the current `NODE_ENV`.
 * 
 * This function loads the environment variables from a specific `.env` file based on the value of `NODE_ENV`.
 * It defaults to loading the `.env.development` file if `NODE_ENV` is not set. The environment variables are loaded
 * using the `dotenv` package.
 * 
 * @function loadConfig
 * @returns {void} This function does not return any value. It modifies the environment variables in `process.env`.
 */
export const loadConfig = () => {
  const env = process.env.NODE_ENV ?? "development";  // Default to "development" if NODE_ENV is not set
  const filepath = path.join(process.cwd(), `.env.${env}`);  // Construct the path to the corresponding .env file
  dotenv.config({ path: filepath });  // Load the environment variables from the specified .env file
};
