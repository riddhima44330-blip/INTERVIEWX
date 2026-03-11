import axios from 'axios';
const fs = require('fs');

async function testApi() {
  try {
    // 1. Try to login (we don't know passwords, let's just signup a dummy user)
    const email = `test_${Date.now()}@example.com`;
    console.log("Signing up:", email);
    const signupRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Testy',
      email: email,
      password: 'password123'
    });
    
    console.log("Signup success, token:", signupRes.data.token);
    const token = signupRes.data.token;

    // 2. Fetch questions
    console.log("Fetching questions...");
    const qRes = await axios.get('http://localhost:5000/api/questions/domain/frontend/level/Beginner', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Questions response:", qRes.data);
    
    // 3. Start interview
    console.log("Starting interview...");
    const startRes = await axios.post('http://localhost:5000/api/interview/start', {
      domain: 'frontend',
      level: 'Beginner',
      questions: qRes.data.questions
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log("Start response:", startRes.data);

  } catch (err) {
    console.log("------------------- ERROR -----------------");
    console.log(err.response?.data || err.message);
  }
}
testApi();
