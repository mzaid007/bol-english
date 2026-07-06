// API endpoint: /api/sync
// POST - Upserts the user profile and progress in MongoDB Atlas based on email.

import { connectToDatabase } from './_db.js';

export default async function handler(req, res) {
  // Allow requests from all origins (CORS) - useful for dev and previews
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed. Use POST.' });
    return;
  }

  const { email, profile, progress } = req.body;

  if (!email) {
    res.status(400).json({ error: 'Email parameter is required.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const updateDoc = {
      $set: {
        profile: profile || {},
        progress: progress || {},
        updatedAt: new Date()
      }
    };

    // Upsert options
    const options = { upsert: true };

    const result = await usersCollection.updateOne({ email: email.toLowerCase().trim() }, updateDoc, options);

    res.status(200).json({
      success: true,
      message: 'Sync completed successfully.',
      matchedCount: result.matchedCount,
      modifiedCount: result.modifiedCount,
      upsertedId: result.upsertedId
    });
  } catch (error) {
    console.error('Database Sync Error:', error);
    res.status(500).json({ error: 'Failed to sync with database.', details: error.message });
  }
}
