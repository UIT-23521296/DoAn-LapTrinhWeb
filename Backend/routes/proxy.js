// routes/proxy.js
const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;
  if (!imageUrl) {
    return res.status(400).json({ msg: 'Missing image URL' });
  }

  try {
    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      headers: {
        'User-Agent': 'Mozilla/5.0',
      }
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxy image:', error.message);
    res.status(500).json({ msg: 'Failed to fetch image' });
  }
});

module.exports = router;
