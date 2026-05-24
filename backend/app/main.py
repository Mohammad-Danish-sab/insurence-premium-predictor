from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import auth, predict, history, admin
from app.database import connect_db, disconnect_db
from slowapi.errors import RateLimitExceeded
from contextlib import asynccontextmanager
from app.config import settings
from app.middleware.rate_limiter import limiter, rate_limit_exceeded_handler
from app.routes.admin import router as admin_router
from app.routes.blogs import router as blog_router
from app.routes.contacts import router as contact_router
from app.routes.activity_logs import router as activity_router
from app.routes.model_monitor import router as monitor_router
from app.routes.blogs import router as blog_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()       
    yield
    await disconnect_db() 


app = FastAPI(
    title="Insurance Premium Prediction API",
    description="AI-powered insurance premium predictor",
    version="1.0.0",
    lifespan=lifespan
)

origins = [
    "http://localhost:5173",    
    "http://localhost:3000",   
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "https://insurence-premium-predictor.vercel.app",

]

# CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# # Connect to MongoDB on startup
# @app.on_event("startup")
# async def startup():
#     await connect_db()

# Register routes
app.include_router(auth.router,    prefix="/api/auth",    tags=["Auth"])
app.include_router(predict.router, prefix="/api/predict", tags=["Prediction"])
app.include_router(history.router, prefix="/api/history", tags=["History"])
app.include_router(admin.router,   prefix="/api/admin",   tags=["Admin"])
app.include_router(blog_router, prefix="/api", tags=["Blogs"])
app.include_router(contact_router, prefix="/api", tags=["Contacts"])
app.include_router(activity_router, prefix="/api", tags=["Activity Logs"])
app.include_router(monitor_router, prefix="/api", tags=["Model Monitor"])
app.include_router(blog_router)

@app.get("/", tags=[" Root"])
async def root():
    return {
        "app":     settings.APP_NAME,
        "version": "1.0.0",
        "status":  "running ",
        "docs":    "/docs",
        "redoc":   "/redoc"
    }

@app.get("/health", tags=["Root"])
async def health_check():
    return {"status": "healthy"}