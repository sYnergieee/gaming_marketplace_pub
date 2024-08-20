from sqlalchemy.ext.declarative import declarative_base
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker


def init():
    load_dotenv()
    username = os.getenv("POSTGRES_USER")
    password = os.getenv("POSTGRES_PASSWORD")
    name_db = os.getenv("POSTGRES_DB")
    host = os.getenv("POSTGRES_HOST")
    port = os.getenv("POSTGRES_PORT")
    db_url = f"postgresql://{username}:{password}@{host}:{port}/{name_db}"
    engine = create_engine(db_url)
    session_local = sessionmaker(autoflush=False, bind=engine)
    return engine, session_local


Base = declarative_base()
Engine, SessionLocal = init()
