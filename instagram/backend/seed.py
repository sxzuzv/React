# 더미 데이터 — 다시 돌리면 처음 상태로 돌아간다
import shutil
from pathlib import Path
from sqlalchemy import text
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from database import engine
from models import User, Post, Comment, Like
from deps import password_hash


# 시드 사진을 media/로 복사 — 글에는 주소(/media/seed_1.jpg)를 넣는다
Path('media').mkdir(exist_ok=True)
for i in range(1, 7):
  shutil.copy(f'seed_images/{i}.jpg', f'media/seed_{i}.jpg')


with Session(engine) as db:
  # 테이블을 비우고 번호(id)도 1부터 다시
  db.execute(text('TRUNCATE likes, comments, posts, users RESTART IDENTITY'))

  alice = User(username='alice', password_hash=password_hash.hash('pw1234'))
  bob = User(username='bob', password_hash=password_hash.hash('pw1234'))
  carol = User(username='carol', password_hash=password_hash.hash('pw1234'))
  db.add_all([alice, bob, carol])
  db.flush()

  # 글마다 쓴 시각을 다르게 — 최신순이 보이도록
  now = datetime.now()
  p1 = Post(content='성수동 카페 다녀왔어요', image_url='/media/seed_1.jpg', user_id=alice.id, created_at=now - timedelta(hours=7))
  p2 = Post(content='오늘 점심은 김치찌개', image_url='/media/seed_2.jpg', user_id=bob.id, created_at=now - timedelta(hours=6))
  p3 = Post(content='FastAPI 공부 중', image_url='/media/seed_3.jpg', user_id=alice.id, created_at=now - timedelta(hours=5))
  p4 = Post(content='오늘 날씨 진짜 좋다', user_id=carol.id, created_at=now - timedelta(hours=4))
  p5 = Post(content='주말에 한강 갈 사람?', image_url='/media/seed_4.jpg', user_id=carol.id, created_at=now - timedelta(hours=3))
  p6 = Post(content='퇴근길 노을', image_url='/media/seed_5.jpg', user_id=bob.id, created_at=now - timedelta(hours=2))
  p7 = Post(content='React 복습하는 중', user_id=alice.id, created_at=now - timedelta(hours=1))
  p8 = Post(content='고양이 산책 중', image_url='/media/seed_6.jpg', user_id=carol.id, created_at=now)
  db.add_all([p1, p2, p3, p4, p5, p6, p7, p8])
  db.flush()

  db.add_all([
    Comment(content='여기 어디예요?', post_id=p1.id, user_id=bob.id),
    Comment(content='저도 가 보고 싶어요', post_id=p1.id, user_id=carol.id),
    Comment(content='맛있겠다', post_id=p2.id, user_id=alice.id),
    Comment(content='저요!', post_id=p5.id, user_id=alice.id),
    Comment(content='하늘 색 예쁘다', post_id=p6.id, user_id=carol.id),
    Comment(content='귀여워요', post_id=p8.id, user_id=bob.id),
    Like(user_id=bob.id, post_id=p1.id),
    Like(user_id=carol.id, post_id=p1.id),
    Like(user_id=alice.id, post_id=p2.id),
    Like(user_id=alice.id, post_id=p6.id),
    Like(user_id=carol.id, post_id=p6.id),
    Like(user_id=alice.id, post_id=p8.id),
    Like(user_id=bob.id, post_id=p8.id),
  ])
  db.commit()

print('시드 완료: 사용자 3 · 글 8(사진 6) · 댓글 6 · 좋아요 7 (비밀번호 모두 pw1234)')
