from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    MONGO_URI: str
    DB_NAME: str = "insurance-premium"
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    APP_NAME: str = "Insurance Premium Prediction"
    DEBUG: bool = False

    class Config:
        env_file = ".env"

settings = Settings()
