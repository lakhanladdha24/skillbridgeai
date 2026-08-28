class CareerPredictor:
    def __init__(self):
        self.roles = {
            "AI Engineer": {"Python": 0.30, "Machine Learning": 0.25, "Deep Learning": 0.25, "DSA": 0.20},
            "ML Engineer": {"Python": 0.30, "Machine Learning": 0.30, "Statistics": 0.20, "DSA": 0.20},
            "Data Scientist": {"Python": 0.25, "Statistics": 0.30, "Machine Learning": 0.25, "SQL": 0.20},
            "Full Stack Developer": {"JavaScript": 0.35, "Web Dev": 0.35, "SQL": 0.15, "Python": 0.15},
            "Software Engineer": {"DSA": 0.40, "Python": 0.20, "System Design": 0.20, "Operating Systems": 0.20}
        }

    def predict_careers(self, user_skills: dict):
        predictions = []

        for role, weights in self.roles.items():
            match_sum = 0.0
            positives = []
            negatives = []

            for sk, w in weights.items():
                val = user_skills.get(sk, 25)
                match_sum += (val / 100.0) * w
                if val >= 65:
                    positives.append(f"Strong {sk}")
                else:
                    negatives.append(f"Requires {sk}")

            pct = round(min(98.0, max(20.0, match_sum * 100.0)), 1)
            confidence = "High" if pct >= 80 else ("Medium" if pct >= 50 else "Low")

            predictions.append({
                "role": role,
                "match_score": pct,
                "confidence": confidence,
                "explanation": {
                    "positive_factors": positives if positives else ["Basic Proficiency"],
                    "areas_to_improve": negatives
                }
            })

        return sorted(predictions, key=lambda x: x["match_score"], reverse=True)

career_predictor = CareerPredictor()
