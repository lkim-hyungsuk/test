from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.routers.auth import verify_token

bearer = HTTPBearer()


def require_admin(credentials: HTTPAuthorizationCredentials = Depends(bearer)) -> str:
    return verify_token(credentials.credentials)
