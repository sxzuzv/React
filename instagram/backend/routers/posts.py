from fastapi import APIRouter
from deps import SessionDep, PostDep, CurrentUserDep, MyPostDep
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from models import Post
from schemas import PostOut, PostCreate, PostUpdate

router = APIRouter(prefix='/api/posts', tags=['posts'])

@router.get('', response_model=list[PostOut])
def post_list(db: SessionDep, skip: int = 0, limit: int = 10):
  posts = db.scalars(
    select(Post)
    .options(selectinload(Post.user), selectinload(Post.likes))
    .order_by(Post.created_at.desc())
    .offset(skip)
    .limit(limit)
  ).all()

  return posts


@router.get('/feed', response_model=list[PostOut])
def feed(db: SessionDep, me: CurrentUserDep, skip: int = 0, limit: int = 10):
  ids = [me.id] # 내가 팔로우 중인 사용자 ID

  for row in me.followings:
    ids.append(row.to_user_id)

  return db.scalars(
    select(Post)
    .options(selectinload(Post.user), selectinload(Post.likes))
    .where(Post.user_id.in_(ids))
    .order_by(Post.created_at.desc())
    .offset(skip)
    .limit(limit)
  ).all()


@router.get('/{post_id}', response_model=PostOut)
def post_detail(post: PostDep):
  return post


@router.post('', response_model=PostOut, status_code=201)
def post_create(data: PostCreate, db: SessionDep, user: CurrentUserDep):
  post = Post(content=data.content, user_id=user.id, image_url=data.image_url)
  db.add(post)
  db.commit()
  return post


@router.patch('/{post_id}', response_model=PostOut)
def post_update(
  post: MyPostDep,
  data: PostUpdate, 
  db: SessionDep,
):
  post.content = data.content
  db.commit()
  return post


@router.delete('/{post_id}', status_code=204)
def post_delete(post: MyPostDep, db: SessionDep):
  db.delete(post)
  db.commit()
