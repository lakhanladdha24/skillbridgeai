const path = require('path');
const fs = require('fs');
const envPath = fs.existsSync(path.join(__dirname, '../../backend/.env')) 
  ? path.join(__dirname, '../../backend/.env')
  : path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });
const mongoose = require('mongoose');
const User = require('../../backend/models/User');

const MONGODB_URI = process.env.MONGODB_URI;

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    await connectToDatabase();
    const { userId, skills } = req.body;
    if (userId && !userId.startsWith('local_') && !userId.startsWith('demo_')) {
      await User.findByIdAndUpdate(userId, { technicalSkills: skills });
    }
    res.json({ success: true, message: 'Profile updated!', skills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
