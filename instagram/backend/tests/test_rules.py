import uuid
from datetime import datetime, timedelta, timezone

import jwt
from fastapi.testclient import TestClient

from deps import ALGORITHM, SECRET_KEY
from main import app

client = TestClient(app)


def login(username, password):
  res = client.post(
    '/api/auth/login',
    data={'username': username, 'password': password}
  )
  token = res.json()['access_token']

  return {'Authorization': f'Bearer {token}'}


def new_username():
  # uuid로 매번 다른 아이디를 만든다 (최대 20글자 제한 → 'u' + 12글자)
  return 'u' + uuid.uuid4().hex[:12]


def make_token(user_id, key=SECRET_KEY, expires_in=timedelta(minutes=30)):
  exp = datetime.now(timezone.utc) + expires_in
  return jwt.encode({'sub': str(user_id), 'exp': exp}, key, algorithm=ALGORITHM)


def bearer(token):
  return {'Authorization': f'Bearer {token}'}


# 1. 가입 → 로그인 → /api/auth/me가 가입한 나를 돌려준다
def test_signup_login_me():
  username = new_username()

  res = client.post('/api/auth/signup', json={'username': username, 'password': 'pw1234'})
  assert res.status_code == 201
  user_id = res.json()['id']

  headers = login(username, 'pw1234')
  res = client.get('/api/auth/me', headers=headers)
  assert res.status_code == 200
  assert res.json() == {'id': user_id, 'username': username}


# 2. 같은 아이디로 두 번 가입하면 409
def test_signup_duplicate_409():
  username = new_username()
  body = {'username': username, 'password': 'pw1234'}

  assert client.post('/api/auth/signup', json=body).status_code == 201
  assert client.post('/api/auth/signup', json=body).status_code == 409


# 3. 아이디가 3글자보다 짧으면 422
def test_signup_short_username_422():
  res = client.post('/api/auth/signup', json={'username': 'ab', 'password': 'pw1234'})
  assert res.status_code == 422


# 4. 틀린 비밀번호로 로그인하면 401
def test_login_wrong_password_401():
  res = client.post('/api/auth/login', data={'username': 'alice', 'password': 'wrong-pw'})
  assert res.status_code == 401


# 5. 토큰 없이 글을 쓰면 401
def test_post_create_without_token_401():
  res = client.post('/api/posts', json={'content': 'no token'})
  assert res.status_code == 401


# 6. 남의 글을 고치거나(PATCH) 지우면(DELETE) 403
def test_other_users_post_patch_delete_403():
  alice = login('alice', 'pw1234')
  bob = login('bob', 'pw1234')

  res = client.post('/api/posts', json={'content': 'alice의 글'}, headers=alice)
  assert res.status_code == 201
  post_id = res.json()['id']

  try:
    res = client.patch(f'/api/posts/{post_id}', json={'content': 'bob이 고침'}, headers=bob)
    assert res.status_code == 403

    res = client.delete(f'/api/posts/{post_id}', headers=bob)
    assert res.status_code == 403
  finally:
    # 테스트로 만든 게시물은 끝에 삭제
    client.delete(f'/api/posts/{post_id}', headers=alice)

  assert client.get(f'/api/posts/{post_id}').status_code == 404


# 7. 서명이 틀린 토큰으로 /api/auth/me를 부르면 401
def test_me_wrong_signature_401():
  user_id = client.get('/api/auth/me', headers=login('alice', 'pw1234')).json()['id']
  token = make_token(user_id, key='wrong-secret-key-wrong-secret-key-1234')

  res = client.get('/api/auth/me', headers=bearer(token))
  assert res.status_code == 401


# 8. 만료된 토큰으로 /api/auth/me를 부르면 401
def test_me_expired_token_401():
  user_id = client.get('/api/auth/me', headers=login('alice', 'pw1234')).json()['id']
  token = make_token(user_id, expires_in=timedelta(minutes=-1))

  res = client.get('/api/auth/me', headers=bearer(token))
  assert res.status_code == 401
