import { fetchLiveYouTubeVideos } from '../../backend/services/ragKnowledgeService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const topic = req.query?.topicTitle || req.query?.courseName || req.query?.q || 'Software Engineering';
        const videos = await fetchLiveYouTubeVideos(topic);
        return res.status(200).json({ videos });
    } catch (err) {
        console.error('Vercel API YouTube Search Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
