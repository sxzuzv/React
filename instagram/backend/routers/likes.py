from fastapi import APIRouter, HTTPException
from deps import PostDep, CurrentUserDep, SessionDep
from models import Like
from schemas import PostOut

router = APIRouter(prefix='/api/posts/{post_id}/likes', tags=['likes'])

@router.post('', response_model=PostOut, status_code=201)
def like_create(post: PostDep, db: SessionDep, user: CurrentUserDep):
  if db.get(Like, (user.id, post.id)):
    raise HTTPException(status_code=409, detail='이미 좋아요를 눌렀습니다.')
  db.add(Like(user_id=user.id, post_id=post.id))
  db.commit()
  return post

@router.delete('', response_model=PostOut)
def like_delete(post: PostDep, db: SessionDep, user: CurrentUserDep):
  like = db.get(Like, (user.id, post.id))
  if like is None:
    raise HTTPException(status_code=404, detail='좋아요를 누르지 않았습니다.')
  db.delete(like)
  db.commit()
  return post