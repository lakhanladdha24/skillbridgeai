CAREER_REQUIREMENTS = {
    "AI Engineer": {"Python": 85, "Machine Learning": 80, "Deep Learning": 75, "DSA": 70, "System Design": 65},
    "ML Engineer": {"Python": 85, "Machine Learning": 85, "Statistics": 75, "DSA": 70, "MLOps": 60},
    "Data Scientist": {"Python": 80, "Statistics": 85, "Machine Learning": 80, "SQL": 80, "Data Visualization": 75},
    "Full Stack Developer": {"JavaScript": 85, "Web Dev": 85, "Python": 75, "SQL": 75, "System Design": 70},
    "Software Engineer": {"DSA": 85, "Python": 80, "C++": 75, "System Design": 75, "Operating Systems": 70}
}

def detect_skill_gaps(target_role: str, user_skills: dict):
    reqs = CAREER_REQUIREMENTS.get(target_role, CAREER_REQUIREMENTS["AI Engineer"])
    
    critical_gaps = []
    moderate_gaps = []
    satisfied_skills = []

    for skill, req_score in reqs.items():
        actual_score = user_skills.get(skill, 20)
        gap = req_score - actual_score

        if gap > 25:
            critical_gaps.append({"skill": skill, "required": req_score, "current": actual_score, "gap": gap})
        elif gap > 5:
            moderate_gaps.append({"skill": skill, "required": req_score, "current": actual_score, "gap": gap})
        else:
            satisfied_skills.append({"skill": skill, "required": req_score, "current": actual_score})

    return {
        "target_role": target_role,
        "critical_gaps": critical_gaps,
        "moderate_gaps": moderate_gaps,
        "satisfied_skills": satisfied_skills
    }
