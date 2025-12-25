import pandas as pd
import numpy as np

def predict(role: str, skills: list, location: str, experience: int, education: str = "bachelors", college_tier: str = "tier3", company_type: str = "service"):
    """
    Predicts fresher salary based on real-world Indian tech market benchmarks.
    Logic incorporates role, education, college tier, and company type for high realism.
    """
    
    # Base Salary by Company Type (The biggest factor for freshers in India)
    # Market Benchmarks 2024:
    # Service: 3.5L - 4.5L
    # Startup: 6L - 12L
    # Product: 10L - 25L
    company_base = {
        "service": 400000,
        "startup": 800000,
        "product": 1400000,
        "maang": 2200000
    }
    
    base = company_base.get(company_type.lower(), 400000)
    
    # Role Multipliers
    role_multipliers = {
        "frontend": 1.0,
        "backend": 1.1,
        "fullstack": 1.2,
        "data": 1.15,
        "ai_ml": 1.4,
        "devops": 1.25,
        "design": 0.95
    }
    role_mult = role_multipliers.get(role.lower(), 1.0)
    
    # College Tier Multipliers (Huge impact on fresher starting salary)
    tier_multipliers = {
        "tier1": 1.8,  # IITs, NITs, BITS
        "tier2": 1.2,  # Reputed private colleges
        "tier3": 1.0   # Others
    }
    tier_mult = tier_multipliers.get(college_tier.lower(), 1.0)
    
    # Education Multipliers
    edu_multipliers = {
        "diploma": 0.7,
        "bachelors": 1.0,
        "masters": 1.2,
        "phd": 1.5
    }
    edu_mult = edu_multipliers.get(education.lower(), 1.0)
    
    # Skills Multiplier
    # Identify high-demand "Premium" skills
    premium_skills = ["python", "react", "node", "aws", "docker", "kubernetes", "pytorch", "tensorflow", "go", "rust", "solidity"]
    skill_count = sum(1 for s in skills if s.lower() in premium_skills)
    skill_mult = 1 + (skill_count * 0.08) # Each premium skill adds 8% value
    
    # Location Multiplier
    loc_multipliers = {
        "bangalore": 1.25,
        "mumbai": 1.2,
        "gurgaon": 1.15,
        "pune": 1.1,
        "hyderabad": 1.1,
        "remote": 1.0,
        "other": 0.9
    }
    loc_mult = loc_multipliers.get(location.lower(), 0.9)
    
    # Experience Multiplier (0-2 years)
    exp_mult = 1 + (experience * 0.2)
    
    # Final Calculation
    predicted = base * role_mult * tier_mult * edu_mult * skill_mult * loc_mult * exp_mult
    
    # Market Caps to keep it realistic
    if company_type == "service":
        predicted = min(predicted, 800000) # TCS/Infosys rarely pay > 8L to freshers
    elif company_type == "startup":
        predicted = min(predicted, 2500000)
    
    return round(predicted, -3)
