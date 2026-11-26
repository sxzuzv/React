from sqlalchemy import func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from database import Base


class User(Base):
  __tablename__ = 'users'

  id: Mapped[int] = mapped_column(primary_key=True)
  username: Mapped[str] = mapped_column(unique=True)
  password_hash: Mapped[str]
  posts: Mapped[list['Post']] = relationship(back_populates='user')

  provider: Mapped[str | None]
  provider_id: Mapped[str | None]

  followings: Mapped[list['Follow']] = relationship(foreign_keys='Follow.from_user_id')
  followers: Mapped[list['Follow']] = relationship(foreign_keys='Follow.to_user_id')


class Post(Base):
  __tablename__ = 'posts'

  id: Mapped[int] = mapped_column(primary_key=True)
  content: Mapped[str]
  created_at: Mapped[datetime] = mapped_column(server_default=func.now())

  # User(1) : Post(N)
  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
  user: Mapped['User'] = relationship(back_populates='posts')

  comments: Mapped[list['Comment']] = relationship(
    back_populates='post', 
    cascade='all, delete-orphan',
    order_by='Comment.id'
  )
  likes: Mapped[list['Like']] = relationship(cascade='all, delete-orphan')

  image_url: Mapped[str | None]


class Comment(Base):
  __tablename__ = 'comments'

  id: Mapped[int] = mapped_column(primary_key=True)
  content: Mapped[str]
  created_at: Mapped[datetime] = mapped_column(server_default=func.now())

  # Post(1) : Comment(N)
  post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'))
  post: Mapped['Post'] = relationship(back_populates='comments')

  # User(1) : Comment(N)
  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))
  user: Mapped['User'] = relationship()


class Like(Base):
  __tablename__ = 'likes'

  # User(N) : Post(M)
  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), primary_key=True)
  post_id: Mapped[int] = mapped_column(ForeignKey('posts.id'), primary_key=True)


class RefreshToken(Base):
  __tablename__ = 'refresh_tokens'

  id: Mapped[str] = mapped_column(primary_key=True)
  user_id: Mapped[int] = mapped_column(ForeignKey('users.id'))


class Follow(Base):
  __tablename__ = 'follows'

  from_user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), primary_key=True)
  to_user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), primary_key=True)