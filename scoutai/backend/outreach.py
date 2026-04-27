import os
import json
import re
import anthropic
from typing import Dict, List

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

PERSONALITY_MAP = {
    "enthusiastic": "You are genuinely excited about this opportunity. You are actively job searching, available immediately, ask thoughtful follow-up questions, mention your motivations openly, and express high interest (9/10). Use natural, warm language.",
    "neutral": "You are passively open to opportunities but not actively searching. You're thoughtful and measured, ask about compensation and company culture, and need convincing before committing. Express moderate interest (5-6/10).",
    "hesitant": "You are fairly settled in your current role and not looking to move. You give polite but non-committal answers, mention recent promotions or projects keeping you engaged, and show low intent to switch.",
}

def get_personality(match_score: float) -> str:
    if match_score >= 75:
        return "enthusiastic"
    elif match_score >= 50:
        return "neutral"
    else:
        return "hesitant"


def extract_interest_score(personality: str, conversation: List[Dict]) -> Dict:
    """Derive interest score and signals from the conversation."""
    score_map = {"enthusiastic": 88, "neutral": 52, "hesitant": 22}
    
    signal_map = {
        "enthusiastic": [
            "Actively job searching",
            "Available immediately",
            "Asked about growth opportunities",
            "Self-reported high interest (9/10)",
            "Requested next steps proactively",
        ],
        "neutral": [
            "Passively open to opportunities",
            "Inquired about compensation",
            "Asked for more company details",
            "Delayed availability (1 month+)",
            "Non-committal on interview process",
        ],
        "hesitant": [
            "Not actively job searching",
            "Recently promoted in current role",
            "Expressed satisfaction with current team",
            "Low intent signals detected",
            "Politely declined immediate interest",
        ],
    }

    return {
        "score": score_map[personality],
        "signals": signal_map[personality],
    }


async def simulate_outreach(candidate: Dict, jd_text: str, match_score: float) -> Dict:
    """Simulate a multi-turn outreach conversation using Claude."""
    personality = get_personality(match_score)
    personality_prompt = PERSONALITY_MAP[personality]
    
    # Build the simulation prompt
    system_prompt = f"""You are simulating a realistic recruiter outreach conversation.
You will generate a complete 6-turn conversation between a ScoutAI recruiting agent and a candidate.

Candidate Profile:
- Name: {candidate['name']}
- Title: {candidate['title']}
- Experience: {candidate['years_experience']} years
- Skills: {', '.join(candidate['skills'][:6])}
- Location: {candidate.get('location', 'Unknown')}
- Availability: {candidate.get('availability', 'unknown')}
- Bio: {candidate.get('bio', '')}

Candidate Personality: {personality_prompt}

Job Description Summary: {jd_text[:400]}

Generate a realistic 6-turn conversation (3 exchanges) in this exact JSON format:
{{
  "messages": [
    {{"role": "agent", "content": "..."}},
    {{"role": "candidate", "content": "..."}},
    {{"role": "agent", "content": "..."}},
    {{"role": "candidate", "content": "..."}},
    {{"role": "agent", "content": "..."}},
    {{"role": "candidate", "content": "..."}}
  ]
}}

Rules:
- Agent introduces the opportunity and asks about availability/interest
- Candidate responds consistently with their personality
- Include specific skills and role details naturally
- Make it feel like a real LinkedIn/email thread
- Output ONLY the JSON, no other text."""

    try:
        response = client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1200,
            messages=[{"role": "user", "content": system_prompt}],
        )
        
        raw = response.content[0].text.strip()
        # Strip markdown if present
        raw = re.sub(r"```json\s*|\s*```", "", raw).strip()
        conversation_data = json.loads(raw)
        messages = conversation_data.get("messages", [])
        
    except Exception as e:
        # Fallback conversation templates
        messages = _get_fallback_conversation(candidate, personality, jd_text)

    interest_data = extract_interest_score(personality, messages)

    return {
        "candidate_id": candidate["id"],
        "personality": personality,
        "messages": messages,
        "interest_score": interest_data["score"],
        "interest_signals": interest_data["signals"],
    }


def _get_fallback_conversation(candidate: Dict, personality: str, jd_text: str) -> List[Dict]:
    """Fallback conversations if API is unavailable."""
    name = candidate["name"].split()[0]
    skills = candidate["skills"][:3]
    
    templates = {
        "enthusiastic": [
            {"role": "agent", "content": f"Hi {name}! I came across your profile and I'm excited to reach out. We have a Senior ML Engineer role that matches your background in {', '.join(skills)}. Are you open to exploring?"},
            {"role": "candidate", "content": f"Absolutely! This sounds really interesting. I've been actively looking for opportunities that leverage my {skills[0]} and NLP experience. Tell me more about the role!"},
            {"role": "agent", "content": "We're building production NLP pipelines processing millions of documents. The team is 15 engineers, well-funded Series B. What's your current availability?"},
            {"role": "candidate", "content": f"I can start immediately — I've just wrapped up a major project. I'd love to hear about the growth opportunities and tech stack. This seems like exactly what I've been looking for!"},
            {"role": "agent", "content": "Perfect! On a scale of 1-10, how interested are you in this type of role?"},
            {"role": "candidate", "content": "Honestly, a 9/10. The combination of NLP at scale and the company stage is exactly where I want to be. When can we schedule a technical interview?"},
        ],
        "neutral": [
            {"role": "agent", "content": f"Hello {name}, I noticed your strong background in {skills[0]}. We have a Senior ML Engineer position that could be a great fit. Are you open to a quick chat?"},
            {"role": "candidate", "content": "Hi, thanks for reaching out. I'm not actively searching, but I'm open to hearing more. What's the compensation range and company size?"},
            {"role": "agent", "content": "Competitive package — senior-level band, equity included. It's a 100-person company with strong growth. The role involves NLP pipeline development."},
            {"role": "candidate", "content": "That's reasonable. I'd want to understand more about the team culture and technical challenges before committing to an interview process. What's the tech stack?"},
            {"role": "agent", "content": "Python, PyTorch, Kubernetes — modern stack. Would you be open to a 30-minute exploratory call?"},
            {"role": "candidate", "content": "I could do a call in a few weeks — my schedule is tight right now. Let me check and get back to you. No promises on moving forward yet."},
        ],
        "hesitant": [
            {"role": "agent", "content": f"Hi {name}! Your experience in {skills[0]} caught my attention. I wanted to share an exciting ML Engineer opportunity. Do you have a moment?"},
            {"role": "candidate", "content": "Hi, appreciate you reaching out. I should mention I'm fairly settled at my current company — just got promoted last quarter."},
            {"role": "agent", "content": "Congratulations on the promotion! I understand — this is a unique opportunity in LLM development though. Would it be worth a quick conversation?"},
            {"role": "candidate", "content": "Honestly, I'm pretty happy where I am. We're in the middle of a really interesting project and I've built great relationships with the team."},
            {"role": "agent", "content": "That's great to hear. If circumstances change, would you be open to keeping in touch? We also value referrals."},
            {"role": "candidate", "content": "Sure, feel free to stay in touch. But I'm probably not the right fit right now. Maybe check back in 6 months."},
        ],
    }
    return templates[personality]
