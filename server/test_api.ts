import axios from 'axios';
import mongoose from 'mongoose';
import connectDB from './server/src/db/connect';
import User from './server/src/models/User';
import dotenv from 'dotenv';
dotenv.config({ path: './server/.env' });

async function testApi() {
  await connectDB();
  // find a user
  const user = await User.findOne();
  if (!user) {
    console.log("No user found.");
    process.exit(1);
  }

  // Generate a token manually using JWT since we need to test
  const jwt = require('jsonwebtoken');
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });

  try {
    const res = await axios.get('http://localhost:5000/api/questions/domain/frontend/level/Beginner', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Questions response:", res.data);
  } catch (err: any) {
    console.error("Error calling questions API:", err.response?.data || err.message);
  }
  
  try {
    const startRes = await axios.post('http://localhost:5000/api/interview/start', {
      domain: 'frontend',
      level: 'Beginner',
      questions: ["Question 1", "Question 2"]
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log("Start Interview response:", startRes.data);
  } catch (err: any) {
    console.error("Error starting interview:", err.response?.data || err.message);
  }

  process.exit(0);
}

testApi();
