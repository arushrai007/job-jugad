import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/jobjugaad")
client = MongoClient(MONGO_URI)
db = client.get_database()

def get_db():
    return db
