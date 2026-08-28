/**
 * Assessment Engine Service
 * Analyzes assessment answers, computes scores, categorizes difficulty & skills,
 * and generates strong/weak/missing skill recommendations.
 */

export function analyzeAssessmentResult(answers = [], questions = [], timeSpentSeconds = 0) {
    const totalQuestions = questions.length || 50;
    let score = 0;
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    const categoryMap = {};
    const difficultyMap = {};
    const skillMap = {};

    questions.forEach((q) => {
        const userAns = answers.find((a) => a.questionId === q.id || a.questionId === String(q.id));
        const category = q.category || 'General CS';
        const difficulty = q.difficulty || 'Medium';
        const skill = q.skill || category;

        // Init stats maps
        if (!categoryMap[category]) categoryMap[category] = { score: 0, total: 0 };
        if (!difficultyMap[difficulty]) difficultyMap[difficulty] = { score: 0, total: 0 };
        if (!skillMap[skill]) skillMap[skill] = { score: 0, total: 0 };

        categoryMap[category].total += 1;
        difficultyMap[difficulty].total += 1;
        skillMap[skill].total += 1;

        if (!userAns || !userAns.selectedOption) {
            unattemptedCount += 1;
        } else if (userAns.selectedOption === q.correctAnswer) {
            score += 1;
            correctCount += 1;
            categoryMap[category].score += 1;
            difficultyMap[difficulty].score += 1;
            skillMap[skill].score += 1;
        } else {
            incorrectCount += 1;
        }
    });

    const percentage = Math.round((score / Math.max(totalQuestions, 1)) * 100);

    // Format category scores
    const categoryScores = Object.keys(categoryMap).map((cat) => ({
        category: cat,
        score: categoryMap[cat].score,
        total: categoryMap[cat].total,
        percentage: Math.round((categoryMap[cat].score / categoryMap[cat].total) * 100)
    }));

    // Format difficulty performance
    const difficultyPerformance = Object.keys(difficultyMap).map((diff) => ({
        difficulty: diff,
        score: difficultyMap[diff].score,
        total: difficultyMap[diff].total
    }));

    // Classify skill levels
    const skillProfiles = Object.keys(skillMap).map((sk) => {
        const pct = Math.round((skillMap[sk].score / skillMap[sk].total) * 100);
        let level = 'Beginner';
        if (pct >= 90) level = 'Professional';
        else if (pct >= 80) level = 'Advanced';
        else if (pct >= 70) level = 'Upper Intermediate';
        else if (pct >= 55) level = 'Intermediate';
        else if (pct >= 40) level = 'Elementary';

        return { skill: sk, percentage: pct, level };
    });

    // Identify Strong, Weak, Missing, Recommended skills
    const strongSkills = skillProfiles.filter((s) => s.percentage >= 70).map((s) => s.skill);
    const weakSkills = skillProfiles.filter((s) => s.percentage < 70).map((s) => s.skill);
    
    // Career target missing skills (e.g. AI / System Design if missing)
    const targetCareerSkills = ["Python", "DSA & Algorithms", "Machine Learning", "System Design", "SQL", "Cloud Computing"];
    const evaluatedSkills = skillProfiles.map((s) => s.skill);
    const missingSkills = targetCareerSkills.filter((sk) => !evaluatedSkills.includes(sk));
    const recommendedSkills = [...weakSkills, ...missingSkills].slice(0, 5);

    return {
        totalQuestions,
        score,
        percentage,
        correctAnswers: correctCount,
        incorrectAnswers: incorrectCount,
        unattempted: unattemptedCount,
        timeSpentSeconds,
        categoryScores,
        difficultyPerformance,
        skillProfiles,
        strongSkills,
        weakSkills,
        missingSkills,
        recommendedSkills
    };
}
