// API endpoint: /api/fetch
// GET - Retrieves user profile and progress from MongoDB Atlas based on email query param.

import { connectToDatabase } from './_db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed. Use GET.' });
    return;
  }

  const { email } = req.query;

  if (!email) {
    res.status(400).json({ error: 'Email parameter is required.' });
    return;
  }

  try {
    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const userRecord = await usersCollection.findOne({ email: email.toLowerCase().trim() });

    if (!userRecord) {
      res.status(200).json({
        success: true,
        exists: false,
        message: 'No record found for this email.'
      });
      return;
    }

    res.status(200).json({
      success: true,
      exists: true,
      profile: userRecord.profile,
      progress: userRecord.progress,
      updatedAt: userRecord.updatedAt
    });
  } catch (error) {
    console.error('Database Fetch Error:', error);
    res.status(500).json({ error: 'Failed to retrieve data from database.', details: error.message });
  }
}
