from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)   

@app.get('/api/get_events')
def get_events():
    return db.get_events()

