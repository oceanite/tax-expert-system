from pydantic import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "Tax Expert System"
    DEBUG: bool = True
    YAML_RULES_PATH: str = "./app/knowledge/rules.yaml"

    class Config:
        env_file = ".env"

settings = Settings()