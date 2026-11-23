import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)


def login(username, password):
  res = client.post(
    '/api/auth/login',
    data={'username': username, 'password': password}
  )
  token = res.json()['access_token']

  return {'Authorization': f'Bearer {token}'}


@pytest.fixture
def alice():
  return login('alice', 'pw1234')


@pytest.fixture
def bob():
  return login('bob', 'pw1234')


@pytest.fixture
def post_id(alice):
  # 테스트마다 새 게시물을 하나 만들고, 테스트가 끝나면 정리한다
  res = client.post('/api/posts', json={'content': '테스트용 글'}, headers=alice)
  assert res.status_code == 201
  pid = res.json()['id']

  yield pid

  # 정리: 좋아요 취소 → 댓글 삭제 → 게시물 삭제 (이미 지워졌어도 에러 없이 넘어간다)
  for headers in (alice, login('bob', 'pw1234')):
    client.delete(f'/api/posts/{pid}/likes', headers=headers)
  for comment in client.get(f'/api/posts/{pid}/comments').json():
    owner = alice if comment['user']['username'] == 'alice' else login('bob', 'pw1234')
    client.delete(f"/api/comments/{comment['id']}", headers=owner)
  client.delete(f'/api/posts/{pid}', headers=alice)


def create_comment(post_id, headers, content='첫 댓글'):
  res = client.post(f'/api/posts/{post_id}/comments', json={'content': content}, headers=headers)
  assert res.status_code == 201
  return res.json()['id']


def my_id(headers):
  return client.get('/api/auth/me', headers=headers).json()['id']


# 1. 댓글을 쓰면 201이고, 그 글의 댓글 목록에 보인다
def test_comment_create_and_listed(post_id, alice):
  res = client.post(f'/api/posts/{post_id}/comments', json={'content': '안녕'}, headers=alice)
  assert res.status_code == 201
  comment_id = res.json()['id']

  res = client.get(f'/api/posts/{post_id}/comments')
  assert res.status_code == 200
  assert comment_id in [c['id'] for c in res.json()]


# 2. 내 댓글을 고치면 200이고, 내용이 바뀐다
def test_comment_update_mine_200(post_id, alice):
  comment_id = create_comment(post_id, alice, '고치기 전')

  res = client.patch(f'/api/comments/{comment_id}', json={'content': '고친 후'}, headers=alice)
  assert res.status_code == 200
  assert res.json()['content'] == '고친 후'

  comments = client.get(f'/api/posts/{post_id}/comments').json()
  assert [c['content'] for c in comments if c['id'] == comment_id] == ['고친 후']


# 3. 남의 댓글을 고치거나(PATCH) 지우면(DELETE) 403
def test_other_users_comment_patch_delete_403(post_id, alice, bob):
  comment_id = create_comment(post_id, alice)

  res = client.patch(f'/api/comments/{comment_id}', json={'content': 'bob이 고침'}, headers=bob)
  assert res.status_code == 403

  res = client.delete(f'/api/comments/{comment_id}', headers=bob)
  assert res.status_code == 403

  # 막혔으니 댓글은 그대로 남아 있어야 한다
  comments = client.get(f'/api/posts/{post_id}/comments').json()
  assert [c['content'] for c in comments if c['id'] == comment_id] == ['첫 댓글']


# 4. 없는 댓글을 고치면 404
def test_comment_update_404(alice):
  res = client.patch('/api/comments/9999999', json={'content': 'x'}, headers=alice)
  assert res.status_code == 404


# 5. 내 댓글을 지우면 204이고, 목록에서 사라진다
def test_comment_delete_mine_204(post_id, alice):
  comment_id = create_comment(post_id, alice)

  res = client.delete(f'/api/comments/{comment_id}', headers=alice)
  assert res.status_code == 204

  comments = client.get(f'/api/posts/{post_id}/comments').json()
  assert comment_id not in [c['id'] for c in comments]


# 6. 하트를 누르면 201이고, 글의 likes에 내가 있다
def test_like_create_201(post_id, alice):
  res = client.post(f'/api/posts/{post_id}/likes', headers=alice)
  assert res.status_code == 201
  assert my_id(alice) in [like['user_id'] for like in res.json()['likes']]

  post = client.get(f'/api/posts/{post_id}').json()
  assert my_id(alice) in [like['user_id'] for like in post['likes']]


# 7. 이미 누른 하트를 또 누르면 409
def test_like_twice_409(post_id, alice):
  assert client.post(f'/api/posts/{post_id}/likes', headers=alice).status_code == 201
  assert client.post(f'/api/posts/{post_id}/likes', headers=alice).status_code == 409


# 8. 하트를 취소하면 200이고, likes에서 내가 빠진다
def test_like_delete_200(post_id, alice):
  assert client.post(f'/api/posts/{post_id}/likes', headers=alice).status_code == 201

  res = client.delete(f'/api/posts/{post_id}/likes', headers=alice)
  assert res.status_code == 200
  assert my_id(alice) not in [like['user_id'] for like in res.json()['likes']]

  post = client.get(f'/api/posts/{post_id}').json()
  assert my_id(alice) not in [like['user_id'] for like in post['likes']]
