import express from 'express';
import axios from 'axios';

const router = express.Router();

const NEWS_API_KEY = process.env.NEWSDATA_API_KEY;

router.get('/api/news', async (req, res) => {
  const query = req.query.q || 'education';
  try {
    const response = await axios.get('https://newsdata.io/api/1/news', {
      params: {
        apikey: NEWS_API_KEY,
        q: query,
        language: 'en',
      },
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error.message);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

export default router;