import os
import json
import re
import anthropic
from typing import Dict, List

# -------------------- CLIENT (SAFE INIT) --------------------
def get_client():
    api_key = os.getenv("ANTHROPIC_API_KEY")

    if not api_key:
        return None

    try:
        return anthropic.Anthropic(api_key=api_key)
    except Exception as e:
        print("Anthropic init error:", e)
        return None


# -------------------- PERSONALITY --------------------
PERSONALITY_MAP = {
    "enthusiastic": "Highly interested, actively job searching, warm and engaging.",
    "neutral": "Moderately interested, cautious, asks questions.",
    "hesitant": "Low interest, settled in current role, non-committal.",
}


def get_personality(match_score: float) -> str:
    if match_score >= 75:
        return "enthusiastic"
    elif match_score >= 50:
        return "neutral"
    else:
        return "hesitant"


# -------------------- INTEREST SCORE --------------------
def extract_interest_score(personality: str) -> Dict:
    score_map = {
        "enthusiastic": 88,
        "neutral": 52,
        "hesitant": 22,
    }

    signal_map = {
        "enthusiastic": [
            "Actively job searching",
            "High enthusiasm",
            "Asked about next steps",
        ],
        "neutral": [
            "Passive interest",
            "Asked about compensation",
        ],
        "hesitant": [
            "Not actively looking",
            "Satisfied with current role",
        ],
    }

    return {
        "score": score_map[personality],
        "signals": signal_map[personality],
    }


# -------------------- MAIN FUNCTION --------------------
async def simulate_outreach(candidate, jd_text, match_score):
    client = get_client()
    personality = get_personality(match_score)

    # -------------------- FALLBACK (SAFE) --------------------
    if not client:
        messages = _get_fallback_conversation(candidate, personality)
        interest = extract_interest_score(personality)

        return {
            "candidate_id": candidate["id"],
            "personality": personality,
            "messages": messages,
            "interest_score": interest["score"],
            "interest_signals": interest["signals"],
        }

    # -------------------- AI PROMPT --------------------
    system_prompt = f"""
You are simulating a recruiter outreach conversation.

Candidate:
- Name: {candidate['name']}
- Role: {candidate['title']}
- Experience: {candidate['years_experience']} years
- Skills: {', '.join(candidate['skills'][:5])}

Personality: {PERSONALITY_MAP[personality]}

Job Description:
{jd_text[:300]}

Generate a realistic 6-message conversation (3 turns each).

Return ONLY JSON:
{{
  "messages": [
    {{"role": "agent", "content": "..."}},
    {{"role": "candidate", "content": "..."}}
  ]
}}
"""

    try:
        response = client.messages.create(
            model="claude-3-sonnet-20240229",
            max_tokens=800,
            messages=[{"role": "user", "content": system_prompt}],
        )

        raw = response.content[0].text.strip()
        raw = re.sub(r"```json\s*|\s*```", "", raw).strip()

        data = json.loads(raw)
        messages = data.get("messages", [])

    except Exception as e:
        print("Anthropic error:", e)
        messages = _get_fallback_conversation(candidate, personality)

    interest = extract_interest_score(personality)

    return {
        "candidate_id": candidate["id"],
        "personality": personality,
        "messages": messages,
        "interest_score": interest["score"],
        "interest_signals": interest["signals"],
    }


# -------------------- FALLBACK --------------------
def _get_fallback_conversation(candidate: Dict, personality: str) -> List[Dict]:
    name = candidate["name"].split()[0]

    templates = {
        "enthusiastic": [
            {"role": "agent", "content": f"Hi {name}, exciting opportunity for you!"},
            {"role": "candidate", "content": "Sounds great, tell me more!"},
            {"role": "agent", "content": "It’s a high-impact ML role."},
            {"role": "candidate", "content": "I’m very interested!"},
            {"role": "agent", "content": "Can we schedule an interview?"},
            {"role": "candidate", "content": "Yes, let's do it."},
        ],
        "neutral": [
            {"role": "agent", "content": f"Hi {name}, I have an opportunity."},
            {"role": "candidate", "content": "I’m open to hearing more."},
            {"role": "agent", "content": "Great role with good growth."},
            {"role": "candidate", "content": "What’s the compensation?"},
            {"role": "agent", "content": "Competitive salary."},
            {"role": "candidate", "content": "Let me think about it."},
        ],
        "hesitant": [
            {"role": "agent", "content": f"Hi {name}, quick opportunity."},
            {"role": "candidate", "content": "Not looking currently."},
            {"role": "agent", "content": "Worth a quick chat?"},
            {"role": "candidate", "content": "Maybe later."},
            {"role": "agent", "content": "I’ll follow up later."},
            {"role": "candidate", "content": "Sure."},
        ],
    }

    return templates[personality]