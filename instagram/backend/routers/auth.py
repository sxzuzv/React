from fastapi import APIRouter, HTTPException, Depends, Response, Cookie
from schemas import UserCreate, UserOut, Token
from deps import SessionDep, password_hash, create_access_token, create_refresh_token, CurrentUserDep, SECRET_KEY, ALGORITHM
from models import User
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
import jwt

router = APIRouter(prefix='/api/auth', tags=['auth'])

@router.post('/signup', response_model=UserOut, status_code=201)
def signup(data: UserCreate, db: SessionDep):
  user = db.scalar(select(User).where(User.username == data.username))
  
  if user:
    raise HTTPException(status_code=409, detail='사용중인 아이디입니다.')
  
  hashed_pw = password_hash.hash(data.password)
  user = User(username=data.username, password_hash=hashed_pw)
  db.add(user)
  db.commit()

  return user


@router.post('/login', response_model=Token)
def login(
  form: Annotated[OAuth2PasswordRequestForm, Depends()],
  response: Response,
  db: SessionDep
):
  user = db.scalar(select(User).where(User.username == form.username))

  # 유저가 없거나 비밀번호가 일치하지 않는다면
  if user is None or not password_hash.verify(form.password, user.password_hash):
    raise HTTPException(status_code=401, detail='아이디 또는 비밀번호가 틀렸습니다.')

  response.set_cookie(
    'refresh_token',
    create_refresh_token(user.id),
    httponly=True,
    samesite='lax',
    max_age=60 * 60 * 24 * 14,
    path='/api/auth'
  )

  token = create_access_token(user.id)

  return {'access_token': token, 'token_type': 'bearer'}


@router.get('/me', response_model=UserOut)
def me(user: CurrentUserDep):
  return user


@router.post('/refresh')
def refresh(
  db: SessionDep,
  refresh_token: Annotated[str | None, Cookie()] = None
):
  # 토큰이 없는 경우 = 사용자가 로그인 하지 않은 상태
  if refresh_token is None:
    raise HTTPException(status_code=401, detail='로그인이 필요합니다.')

  # 토큰이 유효하지 않은 경우
  try:
    payload = jwt.decode(refresh_token, SECRET_KEY, algoritmns=[ALGORITHM])
  except jwt.InvalidTokenError:
    raise HTTPException(status_code=401, detail='토큰이 유효하지 않습니다.')

  # 사용자가 없거나 refresh token 이 아닌 경우
  user = db.get(User, int(payload.get('sub')))
  
  if user is None or payload.get('token_type') != 'refresh':
    raise HTTPException(status_code=401, detail='다시 로그인해주세요.')

  # access_token 발행
  return { 'access_token': create_access_token(user.id), 'token_type': 'bearer' }
