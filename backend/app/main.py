from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predict, history, admin
from app.database import connect_db

app = FastAPI(
    title="Insurance Premium Prediction API",
    description="AI-powered insurance premium predictor",
    version="1.0.0"
)

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect to MongoDB on startup
@app.on_event("startup")
async def startup():
    await connect_db()

# Register routes
app.include_router(auth.router,    prefix="/api/auth",    tags=["Auth"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(admin.router,   prefix="/api/admin",   tags=["Admin"])

@app.get("/")
def root():
    return {"message": "Insurance API is running ✅"}