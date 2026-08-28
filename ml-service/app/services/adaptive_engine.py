def generate_daily_plan(user_skills: dict, weak_skills: list, time_available_mins: int = 120):
    plan_items = []
    
    # Allocations
    if weak_skills:
        primary_weak = weak_skills[0]
        plan_items.append({
            "task": f"Revision: {primary_weak}",
            "duration_mins": 35,
            "category": "Study Notes & Quiz",
            "priority": "High"
        })
    else:
        plan_items.append({
            "task": "Core Topic Review: Python & OOP",
            "duration_mins": 30,
            "category": "Study Notes",
            "priority": "Medium"
        })

    plan_items.append({
        "task": "Coding Practice: LeetCode Medium Problem",
        "duration_mins": 45,
        "category": "Hands-on Coding",
        "priority": "High"
    })

    plan_items.append({
        "task": "Curated Video Tutorial Session",
        "duration_mins": 25,
        "category": "Video Resource",
        "priority": "Medium"
    })

    plan_items.append({
        "task": "Spaced Repetition Flash Quiz",
        "duration_mins": 15,
        "category": "Adaptive Assessment",
        "priority": "High"
    })

    return {
        "total_duration_mins": time_available_mins,
        "plan": plan_items
    }
