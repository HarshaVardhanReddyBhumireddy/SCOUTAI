#!/usr/bin/env python3
"""
Test script to verify the improved JD parsing and percentage-based matching
"""

from jd_parser import parse_jd
from matcher import match_candidates
from candidate_db import CANDIDATES


# Sample JD with multiple skills
SAMPLE_JD = """
Position: Senior Full Stack Developer

We are looking for a passionate Senior Full Stack Developer with 5+ years of experience.

REQUIRED SKILLS:
- Python or JavaScript
- React.js or Vue.js
- Node.js
- PostgreSQL or MongoDB
- Docker
- Kubernetes
- REST APIs
- Git
- AWS
- CI/CD pipelines

NICE-TO-HAVE SKILLS:
- TypeScript
- GraphQL
- Redis
- Apache Kafka
- Microservices architecture
- Machine Learning basics

Responsibilities:
- Build scalable web applications
- Work with microservices and containerized solutions
- Deploy on AWS using Kubernetes
- Collaborate with the ML team

Desired Qualifications:
- Experience with DevOps practices
- Understanding of data pipelines
- Open source contributions
"""


def main():
    print("=" * 80)
    print("SCOUTAI - JD PARSER & MATCHER TEST")
    print("=" * 80)
    
    # Parse JD
    print("\n1. PARSING JOB DESCRIPTION...")
    print("-" * 80)
    parsed_jd = parse_jd(SAMPLE_JD)
    
    print(f"Role: {parsed_jd['role']}")
    print(f"Seniority: {parsed_jd['seniority']}")
    print(f"Min Experience: {parsed_jd['min_experience']} years")
    print(f"Domain: {parsed_jd['domain']}")
    
    print(f"\nRequired Skills ({len(parsed_jd['must_skills'])} total):")
    for i, skill in enumerate(parsed_jd['must_skills'], 1):
        print(f"  {i}. {skill}")
    
    print(f"\nNice-to-Have Skills ({len(parsed_jd['nice_skills'])} total):")
    for i, skill in enumerate(parsed_jd['nice_skills'], 1):
        print(f"  {i}. {skill}")
    
    # Match candidates
    print("\n2. MATCHING CANDIDATES...")
    print("-" * 80)
    matched = match_candidates(parsed_jd, CANDIDATES, top_n=5)
    
    for idx, candidate in enumerate(matched, 1):
        print(f"\n{idx}. {candidate['name']} - Score: {candidate['match_score']}/100")
        print(f"   Title: {candidate['title']}")
        print(f"   Years: {candidate['years_experience']}")
        
        # Show percentage-based breakdown
        details = candidate.get("skill_matching_details", {})
        if details:
            req_pct = details.get("required_percentage", 0)
            req_matched = details.get("matched_required", 0)
            req_total = details.get("total_required", 0)
            nice_pct = details.get("nice_percentage", 0)
            nice_matched = details.get("matched_nice", 0)
            nice_total = details.get("total_nice", 0)
            
            print(f"   ✓ Required Skills: {req_matched}/{req_total} ({req_pct}%)")
            if nice_total > 0:
                print(f"   ✓ Preferred Skills: {nice_matched}/{nice_total} ({nice_pct}%)")
        
        print(f"   Match Reasons:")
        for reason in candidate.get("match_reasons", []):
            print(f"     • {reason}")
    
    print("\n" + "=" * 80)
    print("TEST COMPLETE")
    print("=" * 80)


if __name__ == "__main__":
    main()
