// MongoDB database connection helper for Serverless Functions
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("WARNING: MONGODB_URI environmental variable is not set.");
}

// Caching connection globally across serverless invocations
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI environment variable is missing.");
  }

  const client = await MongoClient.connect(MONGODB_URI);
  const db = client.db('bol_english');

  cachedClient = client;
  cachedDb = db;
  
  return { client, db };
}
