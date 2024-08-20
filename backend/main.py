from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import image_route, game_route, user_route, const_route, product_route
from dotenv import load_dotenv
import os

load_dotenv()
CORS_URL = os.getenv("CORS_URL")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(const_route.router, prefix="/const")
app.include_router(image_route.router, prefix="/img")
app.include_router(game_route.router, prefix="/game")
app.include_router(product_route.router, prefix="/product")
app.include_router(user_route.router, prefix="/user")
