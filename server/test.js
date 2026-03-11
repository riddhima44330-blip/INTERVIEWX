const axios = require('axios');
const mongoose = require('mongoose');
const User = require('./src/models/User').default;
const connectDB = require('./src/db/connect').default;
require('dotenv').config();

async function run() {
  await connectDB();
  const user = await User.findOne();
  if(!user) { console.log('No user'); process.exit(1); }
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '30d' });

  try {
    const res = await axios.get('http://localhost:5000/api/questions/domain/frontend/level/Beginner', { headers: { Authorization: `Bearer ${token}` } });
    console.log("Q:", res.data);
  } catch(e) {
    console.log("err GET:", e.response?.data || e.message);
  }

  try {
    const res2 = await axios.post('http://localhost:5000/api/interview/start', {
      domain: 'frontend',
      level: 'Beginner',
      questions: ["Q1", "Q2"]
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log("START:", res2.data);
  } catch(e) {
    console.log("err POST:", e.response?.data || e.message);
  }
  process.exit(0);
}
run();
