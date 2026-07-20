// MongoDB database connection helper for Serverless Functions
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI environmental variable is not set in Vercel.");
}

// Caching connection globally across serverless function invocations
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing on Vercel.");
  }

  // Connect with a 5-second timeout to prevent serverless function hangs
  const client = await MongoClient.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
  });
  const db = client.db('bol_english');

  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
