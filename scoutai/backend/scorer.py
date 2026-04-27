from typing import List, Dict


def build_shortlist(
    candidates: List[Dict],
    match_weight: float = 0.6,
    interest_weight: float = 0.4,
) -> List[Dict]:
    """Build a ranked shortlist from candidates with match + interest scores."""
    shortlisted = []

    for cand in candidates[:5]:  # Top 5 for outreach
        match_score = cand.get("match_score", 0)
        interest_score = cand.get("interest_score", 0)

        combined_score = round(
            match_weight * match_score + interest_weight * interest_score, 1
        )

        shortlisted.append({
            "id": cand.get("id"),
            "name": cand.get("name"),
            "title": cand.get("title"),
            "years_experience": cand.get("years_experience"),
            "skills": cand.get("skills", []),
            "location": cand.get("location"),
            "availability": cand.get("availability"),
            "education": cand.get("education"),
            "avatar": cand.get("avatar"),
            "match_score": round(match_score, 1),
            "interest_score": round(interest_score, 1),
            "combined_score": combined_score,
            "match_reasons": cand.get("match_reasons", []),
            "interest_signals": cand.get("interest_signals", []),
            "personality": cand.get("personality", "neutral"),
        })

    shortlisted.sort(key=lambda x: x["combined_score"], reverse=True)

    for i, item in enumerate(shortlisted):
        item["rank"] = i + 1

    return shortlisted
