from fastapi import FastAPI

from fastapi.middleware.cors import CORSMiddleware

# IMPORTANT
import config.firebase_config

from controllers.water_controller import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,

    allow_origins=["*"],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "message":
        "Smart Water Monitoring API Running"
    }