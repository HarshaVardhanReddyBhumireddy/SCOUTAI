import re
from typing import Dict, List, Set

# Comprehensive skill map for matching variations
SKILL_ALIASES = {
    # Programming Languages
    "python": ["python", "py"],
    "javascript": ["javascript", "js", "nodejs", "node.js"],
    "typescript": ["typescript", "ts"],
    "java": ["java"],
    "golang": ["go", "golang"],
    "rust": ["rust"],
    "c++": ["c++", "cpp"],
    "c#": ["c#", "csharp", "c-sharp"],
    "ruby": ["ruby"],
    "php": ["php"],
    
    # ML/AI Frameworks
    "pytorch": ["pytorch", "torch"],
    "tensorflow": ["tensorflow", "tf"],
    "keras": ["keras"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "hugging face": ["hugging face", "huggingface", "transformers"],
    "nlp": ["nlp", "natural language processing"],
    "llm": ["llm", "language model", "large language model"],
    
    # Web Frameworks
    "react": ["react", "react.js", "reactjs"],
    "angular": ["angular", "angularjs"],
    "vue": ["vue", "vue.js", "vuejs"],
    "fastapi": ["fastapi", "fast api"],
    "django": ["django", "django rest framework", "drf"],
    "flask": ["flask"],
    "express": ["express", "express.js"],
    "spring": ["spring", "spring boot"],
    
    # DevOps/Infrastructure
    "kubernetes": ["kubernetes", "k8s"],
    "docker": ["docker", "containers"],
    "ci/cd": ["ci/cd", "cicd", "continuous integration"],
    "terraform": ["terraform"],
    "aws": ["aws", "amazon web services"],
    "gcp": ["gcp", "google cloud"],
    "azure": ["azure", "microsoft azure"],
    
    # Databases
    "sql": ["sql", "relational", "rdbms"],
    "postgresql": ["postgresql", "postgres", "psql"],
    "mysql": ["mysql"],
    "mongodb": ["mongodb", "mongo"],
    "redis": ["redis"],
    "elasticsearch": ["elasticsearch"],
    
    # Big Data
    "spark": ["spark", "apache spark"],
    "hadoop": ["hadoop"],
    "kafka": ["kafka", "apache kafka"],
    "airflow": ["airflow", "apache airflow"],
    
    # Other
    "git": ["git", "github", "gitlab"],
    "mlops": ["mlops", "ml ops"],
    "rest api": ["rest", "rest api", "restful"],
    "graphql": ["graphql"],
}

# Domain mapping
DOMAIN_KEYWORDS = {
    "AI/ML": ["machine learning", "deep learning", "neural", "ai", "artificial intelligence", "model", "llm"],
    "NLP": ["nlp", "natural language", "text", "language model", "bert", "gpt"],
    "Backend": ["backend", "api", "microservices", "server", "rest", "grpc"],
    "Frontend": ["frontend", "ui", "ux", "web", "react", "angular", "vue"],
    "Data": ["data engineer", "data pipeline", "etl", "bigdata"],
    "DevOps": ["devops", "infrastructure", "kubernetes", "docker", "deployment"],
    "Cloud": ["cloud", "aws", "gcp", "azure"],
}

# Seniority levels
SENIORITY_LEVELS = {
    "Internship": ["intern", "internship"],
    "Junior": ["junior", "jr.", "entry", "entry-level", "graduate"],
    "Mid-level": ["mid", "mid-level", "intermediate"],
    "Senior": ["senior", "sr.", "lead", "staff", "principal", "architect"],
}


def extract_all_skills(text: str) -> Set[str]:
    """Extract all mentioned skills from text using pattern matching."""
    text_lower = text.lower()
    found_skills = set()
    
    # Check against all known skill aliases
    for skill_key, aliases in SKILL_ALIASES.items():
        for alias in aliases:
            # Use word boundaries to avoid substring matches
            if re.search(r'\b' + re.escape(alias) + r'\b', text_lower):
                found_skills.add(skill_key)
                break
    
    return found_skills


def extract_skills_by_section(text: str) -> tuple:
    """Extract must-have and nice-to-have skills from different sections."""
    must_skills = []
    nice_skills = []
    
    # Patterns for must-have skills
    must_patterns = [
        r"[Mm]ust[\s-]*have[:\s]+([^.\n]+?)(?:\n|$)",
        r"[Rr]equired[:\s]+skills?[:\s]*\n?((?:[-•*]\s*[^\n]+\n?)+)",
        r"[Rr]equirements?[:\s]*\n?((?:[-•*]\s*[^\n]+\n?)+)",
        r"[Ee]ssential[:\s]+([^.\n]+?)(?:\n|$)",
    ]
    
    for pattern in must_patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            raw = match.group(1)
            items = re.split(r'[,;/\n•\-\*]', raw)
            skills = [item.strip().strip('•-* ') for item in items 
                     if 2 < len(item.strip()) < 50 and item.strip()]
            if skills:
                must_skills.extend(skills)
                break
        if must_skills:
            break
    
    # Patterns for nice-to-have skills
    nice_patterns = [
        r"[Nn]ice[\s-]*to[\s-]*have[:\s]+([^.\n]+?)(?:\n|$)",
        r"[Pp]referred[:\s]+([^.\n]+?)(?:\n|$)",
        r"[Bb]onus[:\s]+([^.\n]+?)(?:\n|$)",
        r"[Ad]ditional[:\s]+([^.\n]+?)(?:\n|$)",
    ]
    
    for pattern in nice_patterns:
        matches = re.finditer(pattern, text)
        for match in matches:
            raw = match.group(1)
            items = re.split(r'[,;/\n•\-\*]', raw)
            skills = [item.strip().strip('•-* ') for item in items 
                     if 2 < len(item.strip()) < 50 and item.strip()]
            if skills:
                nice_skills.extend(skills)
                break
        if nice_skills:
            break
    
    return must_skills, nice_skills


def parse_jd(jd_text: str) -> Dict:
    """Parse a job description into structured fields with improved accuracy."""
    text = jd_text.strip()
    text_lower = text.lower()
    
    # 1. Extract role title with better patterns
    role_patterns = [
        r"(?:looking for|hiring|seeking|opening for)[:\s]+([A-Za-z\s]+?)(?:\n|,|$)",
        r"(?:Position|Role|Title)[:\s]+([^\n]+?)(?:\n|$)",
        r"^([A-Z][a-zA-Z\s]*?(?:Engineer|Developer|Scientist|Analyst|Manager|Lead|Architect|Specialist|Officer|Coordinator))",
        r"((?:Senior|Junior|Principal|Staff|Lead)?[\s]?(?:Full[\s-]?Stack|Frontend|Backend|DevOps|ML|Data)?[\s]?(?:Engineer|Developer|Scientist|Analyst))",
    ]
    
    role = "Software Engineer"
    for pattern in role_patterns:
        match = re.search(pattern, text, re.IGNORECASE | re.MULTILINE)
        if match:
            role = match.group(1).strip().title()
            break
    
    # 2. Extract experience level more accurately
    exp_match = re.search(r"(\d+)\+?\s*(?:to|[-–])\s*(\d+)?\s*years?", text, re.IGNORECASE)
    if not exp_match:
        exp_match = re.search(r"(\d+)\+?\s*years?", text, re.IGNORECASE)
    
    min_exp = 2
    if exp_match:
        min_exp = int(exp_match.group(1))
    
    # 3. Determine seniority level
    seniority = "Mid-level"
    text_for_seniority = text_lower
    for level, keywords in SENIORITY_LEVELS.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_for_seniority):
                seniority = level
                break
        if seniority != "Mid-level":
            break
    
    # 4. Extract ALL mentioned skills from the entire JD (NO LIMITS)
    all_mentioned_skills = extract_all_skills(text)
    
    # 5. Extract skills by section (structured extraction)
    must_have_raw, nice_to_have_raw = extract_skills_by_section(text)
    
    # 6. Combine all extracted skills
    # Priority: marked must-have > all mentioned > fallback
    if must_have_raw:
        # Convert raw text to normalized skill keys
        must_skills = list(all_mentioned_skills) if all_mentioned_skills else []
        nice_skills = nice_to_have_raw
    elif all_mentioned_skills:
        must_skills = list(all_mentioned_skills)
        nice_skills = []
    else:
        # Fallback: use common tech stack if no structured skills found
        common_tech = ["Python", "JavaScript", "Java", "TypeScript", "Go", "React", 
                       "FastAPI", "Node.js", "PostgreSQL", "Docker", "Kubernetes",
                       "AWS", "Git", "REST API"]
        must_skills = [tech for tech in common_tech 
                      if re.search(r'\b' + re.escape(tech) + r'\b', text, re.IGNORECASE)]
    
    # 7. Determine domain
    domain = "Technology"
    for d, keywords in DOMAIN_KEYWORDS.items():
        for keyword in keywords:
            if re.search(r'\b' + re.escape(keyword) + r'\b', text_lower):
                domain = d
                break
        if domain != "Technology":
            break
    
    # Combine all skills without arbitrary limits
    all_skills = list(set(must_skills + nice_skills))  # Remove duplicates but keep all
    
    return {
        "role": role,
        "min_experience": min_exp,
        "seniority": seniority,
        "domain": domain,
        "must_skills": must_skills,  # ALL required skills (no limit)
        "nice_skills": nice_skills,  # ALL nice-to-have skills (no limit)
        "all_skills": all_skills,    # ALL skills combined (no limit)
        "total_required_skills": len(must_skills),  # Count of required skills
        "raw_text": jd_text,
    }
