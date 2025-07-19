import { Client, Account, Databases, Storage, Avatars } from "appwrite";

// Validate environment variables
const requiredEnvVars = {
  projectId: import.meta.env.VITE_APPWRITE_PROJECTID,
  url: import.meta.env.VITE_APPWRITE_URL,
  databaseId: import.meta.env.VITE_APPWRITE_DATABASE,
  storageId: import.meta.env.VITE_APPWRITE_STORAGE,
  userCollectionId: import.meta.env.VITE_APPWRITE_USERS,
  postCollectionId: import.meta.env.VITE_APPWRITE_POSTS,
  saveCollectionId: import.meta.env.VITE_APPWRITE_SAVES,
};

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingVars.join(", ")}`
  );
  console.error("Please check your .env.local file and ensure all variables are set");
  console.error("Refer to SETUP.md for configuration instructions");
} else {
  console.log("✅ Environment variables loaded successfully from .env.local");
}

export const appwriteConfig = {
  projectId: requiredEnvVars.projectId || "",
  url: requiredEnvVars.url || "https://cloud.appwrite.io/v1",
  databaseId: requiredEnvVars.databaseId || "",
  storageId: requiredEnvVars.storageId || "",
  userCollectionId: requiredEnvVars.userCollectionId || "",
  postCollectionId: requiredEnvVars.postCollectionId || "",
  saveCollectionId: requiredEnvVars.saveCollectionId || "",
  commentsCollectionId: import.meta.env.VITE_APPWRITE_COMMENTS || "",
};

export const client = new Client();

// Only set up client if project ID is available
if (appwriteConfig.projectId) {
  client.setProject(appwriteConfig.projectId);
  client.setEndpoint(appwriteConfig.url);
  console.log("✅ Appwrite client initialized successfully");
} else {
  console.warn("⚠️ Appwrite client not initialized - missing project ID");
}

export const account = new Account(client);
export const database = new Databases(client);
export const storage = new Storage(client);
export const avatars = new Avatars(client);
