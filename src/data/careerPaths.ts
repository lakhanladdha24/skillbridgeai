export interface Milestone {
    id: string;
    title: string;
    description: string;
    duration: string;
    resources: { name: string; url: string; source: string }[];
    notes?: string;
}

export interface CareerPath {
    id: string;
    title: string;
    description: string;
    matchScore: number;
    milestones: Milestone[];
}

export const careerPaths: Record<string, CareerPath> = {
    'ai_ds': {
        id: 'cp_ai_ds',
        title: 'AI & Data Science Specialist',
        description: 'Master the art of data analysis, model building, and deep learning.',
        matchScore: 98,
        milestones: [
            {
                id: 'ads_m1',
                title: 'Data Science Foundations',
                description: 'Python, Statistics, and Math basics for data science.',
                duration: '4-6 weeks',
                resources: [
                    { name: '100 Days of Python', url: 'https://youtube.com/playlist?list=PLqnslRFeH2UoB7-U_k2x6E9eQvS3T8f6s', source: 'CampusX' },
                    { name: 'CS109: Probability for CS', url: 'https://youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXS7dW4OcsLOD665', source: 'Stanford Online' }
                ],
                notes: 'Focus on NumPy, Pandas, and Descriptive Statistics. Practice with real-world datasets from Kaggle.'
            },
            {
                id: 'ads_m2',
                title: 'Machine Learning Mastery',
                description: 'Supervised, Unsupervised learning and Model Optimization.',
                duration: '8-10 weeks',
                resources: [
                    { name: '100 Days of Machine Learning', url: 'https://youtube.com/playlist?list=PLqnslRFeH2Ur7nd8_Vp94-9mTo8e79Kk0', source: 'CampusX' },
                    { name: 'CS229: Machine Learning', url: 'https://youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXS7dW4OcsLOD665', source: 'Stanford University' }
                ],
                notes: 'Linear Regression, Decision Trees, and Gradient Descent are core. Stanford\'s CS229 provides the mathematical rigor.'
            },
            {
                id: 'ads_m3',
                title: 'Deep Learning & NLP',
                description: 'Neural Networks, PyTorch, and Language Models.',
                duration: '12 weeks',
                resources: [
                    { name: '100 Days of Deep Learning', url: 'https://youtube.com/playlist?list=PLqnslRFeH2Ur7nd8_Vp94-9mTo8e79Kk0', source: 'CampusX' },
                    { name: 'CS230: Deep Learning', url: 'https://youtube.com/playlist?list=PLoROMvodv4rOABXSygHT8quzS94F_HdqC', source: 'Stanford Online' }
                ],
                notes: 'Master Backpropagation and then move to LSTM/Transformers for NLP.'
            }
        ]
    },
    'web_dev': {
        id: 'cp_web_dev',
        title: 'Full-Stack Web Architect',
        description: 'Design and deploy scalable web applications from scratch.',
        matchScore: 92,
        milestones: [
            {
                id: 'wd_m1',
                title: 'Frontend Mastery',
                description: 'Advanced React, TypeScript, and UI Design.',
                duration: '6 weeks',
                resources: [{ name: 'React Course', url: 'https://youtube.com/playlist?list=PL4cUxeGkcC9g7edgrlgjltviV36H8E_No', source: 'Net Ninja' }],
                notes: 'Focus on State Management (Redux/Zustand) and Performance Optimization.'
            },
            {
                id: 'wd_m2',
                title: 'Backend & Systems',
                description: 'Node.js, System Design, and Scalability.',
                duration: '8 weeks',
                resources: [{ name: 'CS110: Principles of Computer Systems', url: 'https://youtube.com/watch?v=kYVHoAn4eLw', source: 'Stanford University' }],
                notes: 'Learn about Caching, Load Balancing, and Microservices architecture.'
            }
        ]
    }
};
