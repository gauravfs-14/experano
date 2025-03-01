import UserInterest from '../models/UserInterest.js';

export async function getPreferencesByUser(req, res) {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Check if user already exists in UserInterestCollection
    const existingUser = await UserInterest.findOne({ uid });

    if (existingUser) {
      // If user exists and has interests, return them
      return res.json({
        message: 'User already exists',
        uid: uid,
        interests: existingUser.interests
      });
    }

    // If user doesn't exist, create new entry
    const newUserInterest = new UserInterest({
      uid: uid,
      interests: [] // Initialize with empty array
    });

    await newUserInterest.save();

    res.status(201).json({
      message: 'New user interest profile created',
      uid: uid,
      interests: []
    });

  } catch (error) {
    console.error('Error in getPreferencesByUser:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
