const path = require('path');
const fs = require('fs');
const envPath = fs.existsSync(path.join(__dirname, '../../backend/.env')) 
  ? path.join(__dirname, '../../backend/.env')
  : path.join(__dirname, '../../.env');
require('dotenv').config({ path: envPath });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../../backend/models/User');

const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'skillbridgeai_secret_123_abc';

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb) return cachedDb;
  const db = await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
  cachedDb = db;
  return db;
}

module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    await connectToDatabase();
    const { name, email, password } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ error: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password || 'default123', salt);

    user = new User({ name, email, password: hashedPassword, technicalSkills: [] });
    await user.save();

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: user._id, name, email, skills: [] } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
