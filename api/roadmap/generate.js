import { searchRoadmap } from '../../backend/services/mlClient.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const { goal, studyTimeDaily } = req.body || {};
        const query = goal || 'Frontend Developer';
        const roadmap = await searchRoadmap(query);
        if (studyTimeDaily) {
            roadmap.studyTimeDaily = studyTimeDaily;
        }
        return res.status(200).json(roadmap);
    } catch (err) {
        console.error('Vercel API Roadmap Generate Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
