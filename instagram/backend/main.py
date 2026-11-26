import logging
import time

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware

from routers import auth, comments, likes, posts, social, uploads, users


app = FastAPI()
logger = logging.getLogger('uvicorn.error')

# 요청마다 주소 · 상태 · 걸린 시간을 한 줄로
@app.middleware('http')
async def log_requests(request: Request, call_next):
  start = time.perf_counter()
  response = await call_next(request)
  ms = (time.perf_counter() - start) * 1000

  logger.info(f'{request.method} {request.url.path} {response.status_code} {ms:.1f}ms')

  return response

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