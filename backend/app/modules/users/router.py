from fastapi import APIRouter, Depends

from app.core.dependencies import get_current_active_user
from app.modules.users.models import User
from app.modules.users.schemas import UserMeResponse

router = APIRouter(prefix='/users', tags=['Users'])


@router.get('/me', response_model=UserMeResponse)
def get_me(current_user: User = Depends(get_current_active_user)) -> User:
    return current_user
