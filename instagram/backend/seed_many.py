from datetime import datetime, timedelta
from sqlalchemy import select
from sqlalchemy.orm import Session
from database import engine
from models import User, Post

with Session(engine) as db:
  users = db.scalars(select(User)).all()
  now = datetime.now()
  for i in range(1, 301):
    user = users[i % len(users)]
    db.add(Post(content=f'{i}번째 글', user_id=user.id, created_at=now - timedelta(days=30, minutes=i)))
  db.commit()

print('게시글 300개를 더했습니다.')