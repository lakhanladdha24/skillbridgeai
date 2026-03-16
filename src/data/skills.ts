export interface Skill {
    id: string;
    name: string;
    category: 'Frontend' | 'Backend' | 'AI/ML' | 'DevOps' | 'Data Science' | 'Mobile';
    level: 'Beginner' | 'Intermediate' | 'Advanced';
    description: string;
    popularity: number;
    icon: string;
    resources?: { name: string; url: string; source: string }[];
}

export const skills: Skill[] = [
    {
        id: '1',
        name: 'React',
        category: 'Frontend',
        level: 'Intermediate',
        description: 'Building modern web interfaces with components',
        popularity: 95,
        icon: 'Atom',
        resources: [{ name: 'React Course', url: 'https://youtube.com/playlist?list=PL4cUxeGkcC9g7edgrlgjltviV36H8E_No', source: 'Net Ninja' }]
    },
    {
        id: '4',
        name: 'Python for Data Science',
        category: 'Data Science',
        level: 'Beginner',
        description: 'Comprehensive Python for DS and ML',
        popularity: 98,
        icon: 'Code2',
        resources: [
            { name: '100 Days of Python', url: 'https://youtube.com/playlist?list=PLqnslRFeH2UoB7-U_k2x6E9eQvS3T8f6s', source: 'CampusX' },
            { name: 'Programming Foundations', url: 'https://youtube.com/playlist?list=PL-XXv-cvA_iAlnI-mAfm1P9Lz6fUfQx9Y', source: 'Stanford Online' }
        ]
    },
    {
        id: '7',
        name: 'Machine Learning',
        category: 'AI/ML',
        level: 'Advanced',
        description: 'Deep dive into ML algorithms and math',
        popularity: 90,
        icon: 'Brain',
        resources: [
            { name: '100 Days of ML', url: 'https://youtube.com/playlist?list=PLqnslRFeH2Ur7nd8_Vp94-9mTo8e79Kk0', source: 'CampusX' },
            { name: 'CS229: Machine Learning', url: 'https://youtube.com/playlist?list=PLoROMvodv4rMiGQp3WXS7dW4OcsLOD665', source: 'Stanford University' }
        ]
    },
    {
        id: '10',
        name: 'Deep Learning',
        category: 'AI/ML',
        level: 'Advanced',
        description: 'Neural networks and deep learning systems',
        popularity: 88,
        icon: 'Zap',
        resources: [
            { name: '100 Days of Deep Learning', url: 'https://youtube.com/playlist?list=PLqnslRFeH2Ur7nd8_Vp94-9mTo8e79Kk0', source: 'CampusX' },
            { name: 'CS230: Deep Learning', url: 'https://youtube.com/playlist?list=PLoROMvodv4rOABXSygHT8quzS94F_HdqC', source: 'Stanford Online' }
        ]
    },
    {
        id: '11',
        name: 'SQL for Data Science',
        category: 'Data Science',
        level: 'Intermediate',
        description: 'Mastering data manipulation with SQL',
        popularity: 92,
        icon: 'Database',
        resources: [
            { name: 'SQL Roadmap', url: 'https://youtube.com/playlist?list=PLqnslRFeH2Urv_C6o-v5r7rW09kP1r8T3', source: 'CampusX' }
        ]
    },
    {
        id: '12',
        name: 'Natural Language Processing',
        category: 'AI/ML',
        level: 'Advanced',
        description: 'How computers process human language',
        popularity: 85,
        icon: 'MessageSquare',
        resources: [
            { name: 'NLP Masterclass', url: 'https://youtube.com/playlist?list=PLqnslRFeH2UrS7rR0G2T2A9d28VPrP3r9', source: 'CampusX' }
        ]
    },
    {
        id: '13',
        name: 'Docker & Kubernetes',
        category: 'DevOps',
        level: 'Intermediate',
        description: 'Containerization and orchestration',
        popularity: 88,
        icon: 'Container',
        resources: [{ name: 'Docker Course', url: 'https://youtube.com/playlist?list=PL4cUxeGkcC9hxjeEtdzehgsh48V7_Wzue', source: 'Net Ninja' }]
    },
    {
        id: '14',
        name: 'AWS Cloud Foundations',
        category: 'DevOps',
        level: 'Beginner',
        description: 'Cloud computing basics',
        popularity: 90,
        icon: 'Cloud',
        resources: [{ name: 'AWS Essentials', url: 'https://youtube.com/playlist?list=PLBfub9Y9N6Onu8Y_O3W365hR6WCHXk3yH', source: 'AWS' }]
    },
    {
        id: '15',
        name: 'Flutter Development',
        category: 'Mobile',
        level: 'Intermediate',
        description: 'Multi-platform mobile apps',
        popularity: 82,
        icon: 'Smartphone',
        resources: [{ name: 'Flutter for Beginners', url: 'https://youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6adUtpuxp79-b', source: 'Net Ninja' }]
    }
];
