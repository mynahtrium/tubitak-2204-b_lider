from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import ping


app = FastAPI(title="DreamForge Backend", version="1.0.0")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(ping.router)


@app.get("/")
def root():
    return {"message": "DreamForge API çalışıyor!"}

