import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression

class SkillPredictor:
    def __init__(self):
        # Baseline cold start training dataset: [accuracy, avg_time_sec, easy_acc, medium_acc, hard_acc]
        X_train = np.array([
            [0.20, 90, 0.30, 0.10, 0.00],
            [0.45, 60, 0.60, 0.40, 0.10],
            [0.65, 45, 0.80, 0.65, 0.35],
            [0.82, 30, 0.95, 0.85, 0.65],
            [0.95, 20, 1.00, 0.95, 0.90]
        ])
        # Target classes: 0: Beginner, 1: Elementary, 2: Intermediate, 3: Advanced, 4: Professional
        y_train = np.array([0, 1, 2, 3, 4])

        self.model = RandomForestClassifier(n_estimators=10, random_state=42)
        self.model.fit(X_train, y_train)

        self.labels = ['Beginner', 'Elementary', 'Intermediate', 'Upper Intermediate', 'Advanced', 'Professional']

    def predict_skill(self, accuracy: float, avg_time_sec: float, easy_acc: float = 0.8, medium_acc: float = 0.5, hard_acc: float = 0.2):
        features = np.array([[accuracy, avg_time_sec, easy_acc, medium_acc, hard_acc]])
        pred_class = self.model.predict(features)[0]
        probs = self.model.predict_proba(features)[0]

        score = round(accuracy * 100, 1)
        level = self.labels[min(pred_class, len(self.labels) - 1)]
        confidence = float(np.max(probs))

        return {
            "score": score,
            "estimated_level": level,
            "confidence": round(confidence, 2)
        }

skill_predictor = SkillPredictor()
