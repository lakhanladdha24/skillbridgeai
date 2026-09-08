import { getStudyMaterialForTopic } from '../../backend/services/ragKnowledgeService.js';

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        const q = req.query?.q || req.body?.q || 'Software Engineering';
        const material = await getStudyMaterialForTopic(q);
        return res.status(200).json(material);
    } catch (err) {
        console.error('Vercel API Study Topic Error:', err);
        return res.status(500).json({ error: err.message });
    }
}
