def compute_recommendation_score(item, user_skills, target_role):
    # Skill Gap weight (0.30)
    skill_name = item.get("skill", "General")
    user_score = user_skills.get(skill_name, 30)
    gap_score = max(0.0, (80.0 - user_score) / 100.0)

    # Career Relevance (0.20)
    career_relevance = 0.90 if target_role.lower() in item.get("category", "").lower() or skill_name.lower() in target_role.lower() else 0.50

    # Content Similarity (0.20)
    content_match = 0.85

    # Difficulty Match (0.15)
    diff = item.get("difficulty", "Medium")
    if user_score < 50 and diff == "Easy": diff_match = 1.0
    elif 50 <= user_score <= 80 and diff == "Medium": diff_match = 1.0
    elif user_score > 80 and diff == "Hard": diff_match = 1.0
    else: diff_match = 0.60

    # User History / Popularity (0.15)
    user_hist = 0.75

    final_score = (0.30 * gap_score) + (0.20 * career_relevance) + (0.20 * content_match) + (0.15 * diff_match) + (0.15 * user_hist)
    return round(final_score * 5.0, 2)
