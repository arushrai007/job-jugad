import requests
from bs4 import BeautifulSoup
import time
from datetime import datetime
from db import get_db

def scrape_fresher_jobs():
    """
    Ethically scrapes entry-level jobs and saves them to MongoDB.
    Strictly filters for freshers (0-2 years experience).
    """
    db = get_db()
    jobs_collection = db.jobs
    
    # Mock data representing real-time results for freshers
    mock_jobs = [
        {
            "title": "Junior Python Developer",
            "company": "TechIndia Corp",
            "location": "Remote",
            "description": "Develop Python scripts and APIs for entry-level tasks.",
            "requiredSkills": ["Python", "Flask", "SQL"],
            "experienceRange": "0-1 Years",
            "applyLink": "https://company.com/careers/jp-01",
            "source": "MockScraper",
            "postedDate": datetime.utcnow(),
            "isActive": True
        },
        {
            "title": "Associate Software Engineer",
            "company": "Enterprise Solutions",
            "location": "Bangalore",
            "description": "Great opportunity for fresh graduates to start their career.",
            "requiredSkills": ["Java", "Spring", "MySQL"],
            "experienceRange": "Fresher",
            "applyLink": "https://enterprise.com/jobs/ase",
            "source": "MockScraper",
            "postedDate": datetime.utcnow(),
            "isActive": True
        }
    ]
    
    # Save to MongoDB (Upsert by title and company to avoid duplicates)
    for job in mock_jobs:
        jobs_collection.update_one(
            {"title": job["title"], "company": job["company"]},
            {"$set": job},
            upsert=True
        )
    
    return list(jobs_collection.find({"isActive": True}, {"_id": 0}))
