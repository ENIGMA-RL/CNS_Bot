const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = 3000;

app.get('/login', (req, res) => {
  const authorizeURL = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${encodeURIComponent('http://localhost:3000/callback')}&response_type=code&scope=identify`;
  res.redirect(authorizeURL);
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;

  const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'http://localhost:3000/callback',
    }),
  });

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  const userResponse = await fetch('https://discord.com/api/users/@me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-Track': '1',
    },
  });

  const userData = await userResponse.json();

  // Log for backend dev view
  console.log('--- Discord User Data ---');
  console.log(JSON.stringify(userData, null, 2));
  console.log('-------------------------');

  // Respond in browser
  res.send(`
    <h1>✅ Identity Received</h1>
    <pre>${JSON.stringify(userData, null, 2)}</pre>
    <p>Check terminal for log. You may close this tab.</p>
  `);
});

app.listen(port, () => {
  console.log(`OAuth server running at http://localhost:${port}`);
});
