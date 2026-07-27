// js/appwrite.js

import {
    Client,
    Account,
    Databases,
    Storage,
    Functions
} from "https://cdn.jsdelivr.net/npm/appwrite@18.1.1/+esm";

// Appwrite Configuration
export const APPWRITE_ENDPOINT = "https://fra.cloud.appwrite.io/v1";
export const APPWRITE_PROJECT_ID = "6a634fdc00148a907132";

// Add these IDs when you create them
export const DATABASE_ID = "";
export const PROFILES_TABLE_ID = "";
export const POSTS_TABLE_ID = "";
export const MESSAGES_TABLE_ID = "";
export const STORAGE_BUCKET_ID = "";

// Initialize Client
const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID);

// Export Appwrite Services
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);

export default client;
