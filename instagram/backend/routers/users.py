from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select

from models import User, Post, Follow
from deps import SessionDep, CurrentUserDep
from schemas import ProfileOut


router = APIRouter(prefix='/api/users', tags=['users'])

def get_user_or_404(username: str, db: SessionDep):
    user = db.scalar(select(User).where(User.username == username))

    if user is None:
        raise HTTPException(status_code=404, detail='존재하지 않는 사용자입니다.')

    return user

UserDep = Annotated[User, Depends(get_user_or_404)]


@router.get('/{username}', response_model=ProfileOut)
def profile(user: UserDep):
    return user


@router.get('/{username}/posts')
def user_posts(user: UserDep, db: SessionDep):
    return db.scalars(select(Post).where(Post.user_id == user.id)).all()


@router.post('/{username}/follow', response_model=ProfileOut)
def follow(user: UserDep, db: SessionDep, me: CurrentUserDep):
    if user.id == me.id:
        raise HTTPException(status_code=400, detail='나를 팔로우 할 수 없습니다.')

    if db.get(Follow, (me.id, user.id)):
        raise HTTPException(status_code=400, detail='이미 팔로우 한 사용자입니다.')

    db.add(Follow(from_user_id=me.id, to_user_id=user.id))
    db.commit()

    return user


@router.delete('/{username}/follow', response_model=ProfileOut)
def unfollow(user: UserDep, db: SessionDep, me: CurrentUserDep):
    row = db.get(Follow, (me.id, user.id))
    if row is None:
        raise HTTPException(status_code=404, detail='팔로우 하지 않았습니다.')

    db.delete(row)
    db.commit()

    return user