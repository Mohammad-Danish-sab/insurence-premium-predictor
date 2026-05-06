from motor.motor_asyncio import AsyncIOMotorClient
from app.config import settings

client = None
db = None

async def connect_db():
    global client, db
    client = AsyncIOMotorClient(settings.MONGO_URI)
    db = client[settings.DB_NAME]
    print("MongoDB connected")

async def disconnect_db():
    global client
    if client:
        client.close()
        print(" MongoDB Disconnected")

def get_db():
    return db