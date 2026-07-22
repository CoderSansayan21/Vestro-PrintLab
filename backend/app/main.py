import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api_router import api_router
from app.core.database import test_database_connection


def get_cors_origins() -> list[str]:
    origins = os.getenv('BACKEND_CORS_ORIGINS', 'http://localhost:5173,http://127.0.0.1:5173')
    return [origin.strip() for origin in origins.split(',') if origin.strip()]


@asynccontextmanager
async def lifespan(app: FastAPI):
    if not test_database_connection():
        raise RuntimeError('Database connection failed during application startup.')

    yield


app = FastAPI(title='VESTRO PRINTLAB API', lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(api_router)
