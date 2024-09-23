const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(bodyParser.json());
const CLIENT_ID = 'f4567ce0-13f0-4eba-a0ca-4541380b0c92';  // Update this with your Integration Key
const CLIENT_SECRET = 'db3d1aa4-1673-4081-9db5-2774e0607dbd';   // Update this with your Secret Key
app.post('/oauth/token', async (req, res) => {
  try {
    const response = await axios.post('https://account-d.docusign.com/oauth/token', req.body, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
      }
    });
    res.json(response.data);
  } catch (error) {
    res.status(error.response ? error.response.status : 500).json({ error: error.message });
  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));