# instagram

인스타그램 클론을 만드는 저장소입니다. `backend/`는 지난주에 만든 insta API(가입 · 로그인 · 글 · 사진 · 좋아요 · 댓글)이고, `frontend/`에는 이번 주에 React 화면을 만듭니다.

## 폴더 구조

```
instagram/
├── backend/
│   ├── main.py          # 앱 · 라우터 붙이는 곳 · /media
│   ├── config.py        # .env 읽기
│   ├── database.py      # engine · Base
│   ├── models.py        # 테이블 넷(users · posts · comments · likes)
│   ├── schemas.py       # 요청 · 응답 모양
│   ├── deps.py          # SessionDep · 로그인 · 내 글만
│   ├── photos.py        # 사진 저장
│   ├── routers/         # auth · posts · comments · likes · uploads
│   ├── tests/           # pytest
│   ├── alembic/         # 테이블 리비전
│   ├── seed.py          # 더미 데이터
│   └── seed_images/     # 더미 데이터 사진(CC0 — SOURCES.md)
└── frontend/            # React(Vite) — 수업에서 만든다
```

## 시작하기

### 1. 내 저장소 만들기

1. 이 저장소 오른쪽 위의 **Use this template** → **Create a new repository**를 누릅니다.
2. 저장소 이름은 `instagram`, 공개 범위는 **Private**으로 만듭니다.

### 2. 내려받기 · 설치

```bash
git clone https://github.com/내아이디/instagram.git
cd instagram
code .
```

VS Code 터미널에서:

```bash
cd backend
uv sync
```

### 3. `.env` 만들기

`backend`에서:

```bash
cp .env.example .env
uv run python -c "import secrets; print(secrets.token_hex(32))"
```

VS Code에서 `backend/.env`를 열어 두 줄을 채우고 저장합니다.

```
DB_URL=postgresql+psycopg://sd4:sd4@localhost:5432/instagram
SECRET_KEY=위에서_나온_64글자
```

### 4. DB 만들기

```bash
psql -d postgres     # macOS
psql -U postgres     # Windows
```

```sql
CREATE DATABASE instagram OWNER sd4;
\q
```

### 5. 테이블과 더미 데이터

`backend`에서:

```bash
uv run alembic upgrade head
uv run python seed.py
```

`시드 완료: 사용자 3 · 글 8(사진 6) · 댓글 6 · 좋아요 7 (비밀번호 모두 pw1234)`이 나오면 됩니다. 사용자는 `alice`, `bob`, `carol`입니다. `seed.py`는 다시 돌리면 처음 상태로 돌아갑니다.

### 6. 실행 · 테스트

`backend`에서:

```bash
uv run fastapi dev
```

http://localhost:8000/docs 에 주소 목록이 보이면 됩니다. 새 터미널에서 `backend`로 가서:

```bash
uv run pytest
```
