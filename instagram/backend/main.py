from fastapi import FastAPI
from routers import posts, auth, likes, comments, uploads
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.include_router(posts.router)
app.include_router(auth.router)
app.include_router(likes.router)
app.include_router(comments.router)
app.include_router(uploads.router)

app.mount('/media', StaticFiles(directory='media'))