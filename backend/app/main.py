from fastapi import FastAPI
#from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from .database import engine
from .routes.tasks import router as tasks_router


app = FastAPI(title="TaskFlow API")


# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:8080"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )


app.include_router(tasks_router)


@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "service": "taskflow-backend",
    }


@app.get("/api/db-health")
def database_health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "ok",
        "database": "connected",
    }