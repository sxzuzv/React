import io
from pathlib import Path

import pytest
from fastapi.testclient import TestClient
from PIL import Image
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
def cleanup(alice):
  # 테스트 중에 만들어진 사진 파일과 게시물을 기록해 두었다가, 테스트가 끝나면 지운다
  created = {'image_urls': [], 'post_ids': []}

  yield created

  for pid in created['post_ids']:
    client.delete(f'/api/posts/{pid}', headers=alice)
  for url in created['image_urls']:
    # '/media/abc.jpg' → 'media/abc.jpg' (이미 없어도 에러 없이 넘어간다)
    Path(url.lstrip('/')).unlink(missing_ok=True)


def make_image_file():
  # 진짜 이미지 파일을 메모리에서 만든다 (파일을 따로 저장해 둘 필요 없음)
  buffer = io.BytesIO()
  Image.new('RGB', (100, 100), 'red').save(buffer, format='PNG')
  buffer.seek(0)
  return {'photo': ('test.png', buffer, 'image/png')}


def upload_photo(headers, cleanup):
  res = client.post('/api/uploads', files=make_image_file(), headers=headers)
  if res.status_code == 201:
    cleanup['image_urls'].append(res.json()['image_url'])
  return res


# 1. 사진을 올리면 201이고, image_url이 /media/로 시작한다
def test_upload_photo_201(alice, cleanup):
  res = upload_photo(alice, cleanup)
  assert res.status_code == 201
  assert res.json()['image_url'].startswith('/media/')


# 2. 사진이 아닌 파일을 올리면 400
def test_upload_not_photo_400(alice):
  files = {'photo': ('memo.txt', io.BytesIO('사진 아님'.encode()), 'text/plain')}
  res = client.post('/api/uploads', files=files, headers=alice)
  assert res.status_code == 400


# 3. 토큰 없이 올리면 401
def test_upload_without_token_401():
  res = client.post('/api/uploads', files=make_image_file())
  assert res.status_code == 401


# 4. 올려서 받은 image_url로 글을 쓰면 201이고, 그 글의 image_url이 같은 주소다
def test_post_with_uploaded_image_url(alice, cleanup):
  image_url = upload_photo(alice, cleanup).json()['image_url']

  res = client.post('/api/posts', json={'content': '사진 글', 'image_url': image_url}, headers=alice)
  assert res.status_code == 201
  post_id = res.json()['id']
  cleanup['post_ids'].append(post_id)

  post = client.get(f'/api/posts/{post_id}').json()
  assert post['image_url'] == image_url
