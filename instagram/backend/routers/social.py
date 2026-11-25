import secrets

from authlib.integrations.starlette_client import OAuth
from fastapi import APIRouter
from fastapi.responses import RedirectResponse
from sqlalchemy import select
from starlette.requests import Request

from config import settings
from deps import SessionDep, password_hash
from models import User
from routers.auth import set_refresh_cookie


oauth = OAuth()
router = APIRouter(prefix='/api/auth', tags=['social'])

oauth.register(
    name='google',
    client_id=settings.GOOGLE_CLIENT_ID,
    client_secret=settings.GOOGLE_CLIENT_SECRET,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)


@router.get("/google/login")
async def login_via_google(request: Request):
    redirect_uri = request.url_for('auth_via_google')
    return await oauth.google.authorize_redirect(request, redirect_uri)


FRONTEND = 'http://localhost:5173'

def find_or_create_user(db, provider, provider_id, name):
    user = db.scalar(
        select(User)
        .where(User.provider == provider, User.provider_id == provider_id)
    )

    if user:
        return user

    candidate = name
    n = 1
    while db.scalar(select(User).where(User.username == candidate)):
        n += 1
        candidate = f'{candidate}{n}'

    user = User(
        username=candidate,
        password_hash=password_hash.hash(secrets.token_hex(32)),
        provider=provider,
        provider_id=provider_id
    )

    db.add(user)
    db.commit()

    return user
    

@router.get("/google/callback")
async def auth_via_google(request: Request, db: SessionDep):
    try:
        token = await oauth.google.authorize_access_token(request)
    except:
        return RedirectResponse(f'{FRONTEND}/login?error=social')

    user = token['userinfo']

    provider_user = find_or_create_user(
        db,
        'google',
        user.get('sub'),
        user.get('email').split('@')[0]
    )

    response = RedirectResponse(FRONTEND)
    set_refresh_cookie(response, provider_user, db)

    return response