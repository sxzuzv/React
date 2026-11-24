from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from routers import auth, comments, likes, posts, uploads


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
    ],
    allow_headers=['Authorization']
)

app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(uploads.router)

app.mount('/media', StaticFiles(directory='media'))