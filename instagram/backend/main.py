from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from routers import auth, comments, likes, posts, uploads, social, users


app = FastAPI()
app.add_middleware(SessionMiddleware, secret_key="some-random-string")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        'http://localhost:5173',
    ],
    allow_headers=['Authorization'],
    allow_credentials=True,
    allow_methods=['*']
)

app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(uploads.router)
app.include_router(social.router)
app.include_router(users.router)

app.mount('/media', StaticFiles(directory='media'))