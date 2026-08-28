import math
from datetime import datetime

class BayesianKnowledgeTracer:
    def __init__(self, p_init=0.5, p_transit=0.15, p_slip=0.10, p_guess=0.20, decay_lambda=0.015):
        self.p_init = p_init
        self.p_transit = p_transit
        self.p_slip = p_slip
        self.p_guess = p_guess
        self.decay_lambda = decay_lambda

    def update_knowledge(self, p_prev: float, is_correct: bool) -> float:
        """
        Bayesian Knowledge Tracing step update.
        """
        if is_correct:
            p_obs = (p_prev * (1 - self.p_slip)) / ((p_prev * (1 - self.p_slip)) + ((1 - p_prev) * self.p_guess))
        else:
            p_obs = (p_prev * self.p_slip) / ((p_prev * self.p_slip) + ((1 - p_prev) * (1 - self.p_guess)))

        p_next = p_obs + (1 - p_obs) * self.p_transit
        return min(0.99, max(0.01, round(p_next, 4)))

    def apply_memory_decay(self, p_mastery: float, days_inactive: float) -> float:
        """
        Ebbinghaus forgetting curve decay over inactive days.
        """
        decay_factor = math.exp(-self.decay_lambda * max(0.0, days_inactive))
        return min(0.99, max(0.05, round(p_mastery * decay_factor, 4)))

bkt_engine = BayesianKnowledgeTracer()
