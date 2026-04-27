import re
from typing import Dict, List, Set

# -------------------- SKILL MAP --------------------
SKILL_ALIASES = {
    "python": ["python", "py"],
    "javascript": ["javascript", "js", "nodejs", "node.js"],
    "typescript": ["typescript", "ts"],
    "java": ["java"],
    "golang": ["go", "golang"],
    "pytorch": ["pytorch", "torch"],
    "tensorflow": ["tensorflow", "tf"],
    "react": ["react", "react.js"],
    "fastapi": ["fastapi", "fast api"],
    "docker": ["docker"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws"],
    "sql": ["sql"],
    "mongodb": ["mongodb"],
    "nlp": ["nlp", "natural language processing"],
    "llm": ["llm", "large language model"],
}

# -------------------- DOMAIN --------------------
DOMAIN_KEYWORDS = {
    "AI/ML": ["machine learning", "deep learning", "ai", "model", "llm"],
    "Backend": ["backend", "api", "microservices"],
    "Frontend": ["frontend", "react", "ui"],
    "DevOps": ["devops", "docker", "kubernetes"],
}

# -------------------- SENIORITY --------------------
SENIORITY_LEVELS = {
    "Junior": ["junior", "entry"],
    "Mid-level": ["mid", "intermediate"],
    "Senior": ["senior", "lead", "principal"],
}

# -------------------- SKILL EXTRACTION --------------------
def extract_all_skills(text: str) -> Set[str]:
    text_lower = text.lower()
    found = set()

    for skill, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            if re.search(r'\b' + re.escape(alias) + r'\b', text_lower):
                found.add(skill)
                break

    return found


def extract_skills_by_section(text: str):
    must_skills = []
    nice_skills = []  # ✅ FIXED (always initialized)

    # MUST
    must_match = re.search(r"must[- ]?have[:\s]+(.+)", text, re.IGNORECASE)
    if must_match:
        must_skills = re.split(r',|;', must_match.group(1))

    # NICE
    nice_match = re.search(r"nice[- ]?to[- ]?have[:\s]+(.+)", text, re.IGNORECASE)
    if nice_match:
        nice_skills = re.split(r',|;', nice_match.group(1))

    must_skills = [s.strip() for s in must_skills if s.strip()]
    nice_skills = [s.strip() for s in nice_skills if s.strip()]

    return must_skills, nice_skills


# -------------------- MAIN PARSER --------------------
def parse_jd(jd_text: str) -> Dict:
    try:
        text = jd_text.strip()
        text_lower = text.lower()

        # DEFAULTS (🔥 prevents crashes)
        role = "Software Engineer"
        must_skills = []
        nice_skills = []
        all_skills = []
        seniority = "Mid-level"
        min_exp = 0
        domain = "Technology"

        # ---------------- ROLE ----------------
        role_match = re.search(
            r"(senior|junior|lead)?\s*(software|ml|data)?\s*(engineer|developer|scientist)",
            text_lower
        )
        if role_match:
            role = role_match.group(0).title()

        # ---------------- EXPERIENCE ----------------
        exp_match = re.search(r"(\d+)\+?\s*years", text_lower)
        if exp_match:
            min_exp = int(exp_match.group(1))

        # ---------------- SENIORITY ----------------
        for level, keywords in SENIORITY_LEVELS.items():
            if any(k in text_lower for k in keywords):
                seniority = level
                break

        # ---------------- SKILLS ----------------
        extracted_skills = extract_all_skills(text)
        must_raw, nice_raw = extract_skills_by_section(text)

        if extracted_skills:
            must_skills = list(extracted_skills)

        if nice_raw:
            nice_skills = nice_raw

        all_skills = list(set(must_skills + nice_skills))

        # ---------------- DOMAIN ----------------
        for d, keywords in DOMAIN_KEYWORDS.items():
            if any(k in text_lower for k in keywords):
                domain = d
                break

        # ---------------- FINAL SAFE RETURN ----------------
        return {
            "role": role,
            "min_experience": min_exp,
            "seniority": seniority,
            "domain": domain,
            "must_skills": must_skills,
            "nice_skills": nice_skills,
            "all_skills": all_skills,
            "total_required_skills": len(must_skills),
            "raw_text": jd_text,
        }

    except Exception as e:
        print("JD PARSER ERROR:", str(e))

        # 🔥 NEVER RETURN EMPTY (prevents frontend crash)
        return {
            "role": "Unknown",
            "min_experience": 0,
            "seniority": "Unknown",
            "domain": "Unknown",
            "must_skills": [],
            "nice_skills": [],
            "all_skills": [],
            "total_required_skills": 0,
            "raw_text": jd_text,
        }