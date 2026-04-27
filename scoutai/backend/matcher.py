from typing import List, Dict
import math
try:
    from jd_parser import parse_jd
except Exception as e:
    print("ERROR jd_parser:", e)
    def parse_jd(x): return {}

try:
    from matcher import match_candidates
except Exception as e:
    print("ERROR matcher:", e)
    def match_candidates(a, b): return []

try:
    from scorer import build_shortlist
except Exception as e:
    print("ERROR scorer:", e)
    def build_shortlist(a, b, c): return []
def get_skill_similarity(skill1: str, skill2: str) -> float:
    """
    Calculate similarity between two skills using multiple strategies.
    Returns a score between 0 and 1.
    """
    s1_lower = skill1.lower()
    s2_lower = skill2.lower()
    
    # 1. Exact match
    if s1_lower == s2_lower:
        return 1.0
    
    # 2. Check if one is alias of the other
    for skill_key, aliases in SKILL_ALIASES.items():
        aliases_lower = [a.lower() for a in aliases]
        s1_in_alias = s1_lower in aliases_lower
        s2_in_alias = s2_lower in aliases_lower
        
        if s1_in_alias and s2_in_alias:
            return 0.95
    
    # 3. Check substring match (e.g., "JavaScript" contains "script")
    if s1_lower in s2_lower or s2_lower in s1_lower:
        return 0.75
    
    # 4. Check word-level overlap (e.g., "REST API" vs "REST")
    words1 = set(s1_lower.split())
    words2 = set(s2_lower.split())
    common_words = words1 & words2
    if common_words:
        similarity = len(common_words) / max(len(words1), len(words2))
        return similarity * 0.8
    
    # 5. Check semantic similarity using category mapping
    category_map = {
        "programming": ["python", "javascript", "java", "go", "rust", "c++", "ruby", "php", "typescript"],
        "frontend": ["react", "angular", "vue", "html", "css", "web"],
        "backend": ["node", "fastapi", "django", "flask", "spring", "express"],
        "ml": ["pytorch", "tensorflow", "sklearn", "machine learning", "deep learning"],
        "devops": ["docker", "kubernetes", "terraform", "ci/cd", "jenkins"],
        "database": ["sql", "mongodb", "postgres", "mysql", "redis", "elasticsearch"],
    }
    
    s1_category = None
    s2_category = None
    
    for category, skills in category_map.items():
        if any(s in s1_lower for s in skills):
            s1_category = category
        if any(s in s2_lower for s in skills):
            s2_category = category
    
    if s1_category and s2_category and s1_category == s2_category:
        return 0.6
    
    return 0.0


def match_skill_to_candidate(required_skill: str, candidate_skills: List[str]) -> tuple:
    """
    Find best match for a required skill in candidate's skills.
    Returns (best_match_score, matched_skill_name).
    """
    best_score = 0.0
    best_match = None
    
    for cand_skill in candidate_skills:
        similarity = get_skill_similarity(required_skill, cand_skill)
        if similarity > best_score:
            best_score = similarity
            best_match = cand_skill
    
    return best_score, best_match


def compute_match_score(candidate: Dict, parsed_jd: Dict) -> float:
    """
    Compute a 0-100 match score for a candidate against a parsed JD.
    Uses percentage-based scoring for skills accuracy.
    """
    must_skills = parsed_jd.get("must_skills", [])
    nice_skills = parsed_jd.get("nice_skills", [])
    cand_skills = candidate.get("skills", [])
    
    if not must_skills:
        must_skills = parsed_jd.get("all_skills", [])
    
    # ===== SKILL MATCHING WITH PERCENTAGE =====
    
    # Match required skills and track which ones match
    must_skill_matches = []  # Will store (required_skill, matched_skill, score)
    for ms in must_skills:
        score, best_match = match_skill_to_candidate(ms, cand_skills)
        must_skill_matches.append({
            "required": ms,
            "matched_skill": best_match,
            "score": score,
            "is_matched": score >= 0.6  # True if considered a match
        })
    
    nice_skill_matches = []
    for ns in nice_skills:
        score, best_match = match_skill_to_candidate(ns, cand_skills)
        nice_skill_matches.append({
            "required": ns,
            "matched_skill": best_match,
            "score": score,
            "is_matched": score >= 0.6
        })
    
    # Calculate percentage of matched required skills
    total_required = len(must_skills)
    matched_required = sum(1 for m in must_skill_matches if m["is_matched"])
    
    if total_required > 0:
        required_percentage = (matched_required / total_required) * 100
        required_score = (matched_required / total_required) * 50
    else:
        required_percentage = 100
        required_score = 50
    
    # Calculate percentage of matched nice-to-have skills
    total_nice = len(nice_skills)
    matched_nice = sum(1 for m in nice_skill_matches if m["is_matched"])
    
    if total_nice > 0:
        nice_percentage = (matched_nice / total_nice) * 100
        nice_score = (matched_nice / total_nice) * 20
    else:
        nice_percentage = 0
        nice_score = 10  # Give some points if no nice skills required
    
    # Experience matching (15% weight)
    min_exp = parsed_jd.get("min_experience", 2)
    max_exp = min_exp + 5
    cand_years = candidate.get("years_experience", 0)
    
    if cand_years >= max_exp:
        exp_score = 15
    elif cand_years >= min_exp:
        exp_score = 12 + ((cand_years - min_exp) / 5) * 3
    elif cand_years >= min_exp - 1:
        exp_score = 8
    else:
        exp_score = 3
    
    # Seniority matching (10% weight)
    seniority_mapping = {
        "Internship": ["Internship"],
        "Junior": ["Internship", "Junior"],
        "Mid-level": ["Junior", "Mid-level", "Senior"],
        "Senior": ["Mid-level", "Senior"],
    }
    
    jd_seniority = parsed_jd.get("seniority", "Mid-level")
    cand_title = candidate.get("title", "")
    cand_seniority = "Mid-level"
    
    title_lower = cand_title.lower()
    if any(s in title_lower for s in ["senior", "lead", "principal", "staff", "architect"]):
        cand_seniority = "Senior"
    elif any(s in title_lower for s in ["junior", "associate", "entry"]):
        cand_seniority = "Junior"
    
    acceptable_seniorities = seniority_mapping.get(jd_seniority, ["Mid-level"])
    seniority_score = 10 if cand_seniority in acceptable_seniorities else 5
    
    # Domain match (5% weight)
    jd_domain = parsed_jd.get("domain", "").lower()
    cand_domain = candidate.get("domain", "").lower()
    domain_score = 0
    if jd_domain and cand_domain:
        if jd_domain == cand_domain or (jd_domain in cand_domain or cand_domain in jd_domain):
            domain_score = 5
    
    total = required_score + nice_score + exp_score + seniority_score + domain_score
    final_score = round(min(99, max(0, total)), 1)
    
    # Store matching details for detailed reporting
    candidate["skill_matching_details"] = {
        "required_percentage": round(required_percentage, 1),
        "matched_required": matched_required,
        "total_required": total_required,
        "nice_percentage": round(nice_percentage, 1),
        "matched_nice": matched_nice,
        "total_nice": total_nice,
        "required_matches": must_skill_matches,
        "nice_matches": nice_skill_matches,
    }
    
    return final_score


def get_match_reasons(candidate: Dict, parsed_jd: Dict) -> List[str]:
    """Generate human-readable match explanation with percentage-based data."""
    reasons = []
    
    # Get skill matching details if available
    details = candidate.get("skill_matching_details", {})
    
    if details:
        # Required skills percentage
        required_percentage = details.get("required_percentage", 0)
        matched_required = details.get("matched_required", 0)
        total_required = details.get("total_required", 0)
        
        if total_required > 0:
            reasons.append(f"✓ Required Skills: {matched_required}/{total_required} ({required_percentage}%)")
        
        # Nice-to-have skills percentage
        nice_percentage = details.get("nice_percentage", 0)
        matched_nice = details.get("matched_nice", 0)
        total_nice = details.get("total_nice", 0)
        
        if total_nice > 0 and nice_percentage > 0:
            reasons.append(f"✓ Preferred Skills: {matched_nice}/{total_nice} ({nice_percentage}%)")
        
        # Show top matched skills
        required_matches = details.get("required_matches", [])
        matched_skills_display = [m.get("matched_skill") for m in required_matches[:3] if m.get("is_matched", False)]
        if matched_skills_display:
            reasons.append(f"✓ Has: {', '.join(filter(None, matched_skills_display[:3]))}")
    else:
        # Fallback when details not available
        must_skills = parsed_jd.get("must_skills", [])
        cand_skills_raw = candidate.get("skills", [])
        
        if must_skills:
            must_matched = []
            for ms in must_skills:
                score, best_match = match_skill_to_candidate(ms, cand_skills_raw)
                if score >= 0.6:
                    must_matched.append(best_match)
            
            matched_count = len(must_matched)
            total_required = len(must_skills)
            percentage = (matched_count / total_required * 100) if total_required > 0 else 0
            reasons.append(f"✓ Required Skills: {matched_count}/{total_required} ({percentage:.0f}%)")
    
    # Experience analysis
    min_exp = parsed_jd.get("min_experience", 2)
    cand_years = candidate.get("years_experience", 0)
    
    if cand_years >= min_exp:
        reasons.append(f"✓ {cand_years} years experience (meets {min_exp}+ requirement)")
    else:
        gap = min_exp - cand_years
        reasons.append(f"⚠ {cand_years} years experience ({gap} year(s) short)")
    
    # Availability
    avail = candidate.get("availability", "")
    if avail == "immediate":
        reasons.append("⚡ Available immediately")
    elif avail and "month" in avail.lower():
        reasons.append(f"📅 {avail}")
    
    return reasons[:4]


def match_candidates(parsed_jd: Dict, candidates: List[Dict], top_n: int = 10) -> List[Dict]:
    """Score and rank all candidates, return top N with detailed match info."""
    scored = []
    
    for cand in candidates:
        score = compute_match_score(cand, parsed_jd)
        reasons = get_match_reasons(cand, parsed_jd)
        
        scored.append({
            **cand,
            "match_score": score,
            "match_reasons": reasons,
        })
    
    # Sort by match score (descending)
    scored.sort(key=lambda x: x["match_score"], reverse=True)
    
    return scored[:top_n]
