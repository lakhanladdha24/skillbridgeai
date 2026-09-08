import { searchRoadmap } from '../../backend/services/mlClient.js';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const query = req.body?.query || req.query?.q || 'Frontend Developer';
        const roadmap = await searchRoadmap(query);
        return res.status(200).json(roadmap);
    } catch (err) {
        console.error('Vercel API Roadmap Search Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
