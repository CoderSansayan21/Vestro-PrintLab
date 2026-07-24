from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.dependencies import get_current_user
from app.core.exceptions import DatabaseOperationError, InactiveUserError, InvalidCredentialsError
from app.modules.users.models import User
from app.modules.users.schemas import ChangePasswordRequest, SuccessMessageResponse, UserResponse
from app.modules.users.service import change_password, get_current_user_profile

router = APIRouter(prefix='/users', tags=['Users'])


@router.get(
    '/me',
    response_model=UserResponse,
    responses={status.HTTP_401_UNAUTHORIZED: {'description': 'Missing, invalid, or expired bearer token.'}},
)
def get_me(current_user: User = Depends(get_current_user)) -> UserResponse:
    """Return the authenticated user's profile."""
    return get_current_user_profile(current_user)


@router.put(
    '/change-password',
    response_model=SuccessMessageResponse,
    responses={
        status.HTTP_400_BAD_REQUEST: {'description': 'Current password is incorrect or the new password is unchanged.'},
        status.HTTP_403_FORBIDDEN: {'description': 'Inactive account.'},
        status.HTTP_500_INTERNAL_SERVER_ERROR: {'description': 'Password could not be updated.'},
    },
)
def change_current_user_password(
    password_data: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
) -> SuccessMessageResponse:
    """Change the authenticated user's password."""
    try:
        return change_password(db, current_user, password_data)
    except InvalidCredentialsError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc
    except InactiveUserError as exc:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=str(exc)) from exc
    except DatabaseOperationError as exc:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(exc)) from exc
