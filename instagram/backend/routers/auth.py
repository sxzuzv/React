from fastapi import APIRouter, HTTPException, Depends
from schemas import UserCreate, UserOut, Token
from deps import SessionDep, password_hash, create_access_token, CurrentUserDep
from models import User
from sqlalchemy import select
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated

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
def login(form: Annotated[OAuth2PasswordRequestForm, Depends()] , db: SessionDep):
  user = db.scalar(select(User).where(User.username == form.username))

  # 유저가 없거나 비밀번호가 일치하지 않는다면
  if user is None or not password_hash.verify(form.password, user.password_hash):
    raise HTTPException(status_code=401, detail='아이디 또는 비밀번호가 틀렸습니다.')

  token = create_access_token(user.id)

  return {'access_token': token, 'token_type': 'bearer'}


@router.get('/me', response_model=UserOut)
def me(user: CurrentUserDep):
  return user

