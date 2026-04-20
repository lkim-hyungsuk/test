from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str
    resend_api_key: str
    admin_email: str
    admin_password: str
    jwt_secret: str
    frontend_url: str = "http://localhost:3000"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60 * 24

    class Config:
        env_file = ".env"


settings = Settings()
