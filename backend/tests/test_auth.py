import os
from datetime import datetime, timedelta, timezone

os.environ['DATABASE_URL'] = 'sqlite://'
os.environ['SECRET_KEY'] = 'test-secret-key-for-auth-tests'
os.environ['ALGORITHM'] = 'HS256'
os.environ['ACCESS_TOKEN_EXPIRE_MINUTES'] = '30'

from fastapi import Depends
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import create_engine, select
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import get_settings
from app.core.database import Base, get_db
from app.core.dependencies import get_current_active_user, get_current_admin_user
from app.core.security import create_access_token, hash_password, verify_password
from app.main import app
from app.modules.auth.email_service import development_email_service
from app.modules.auth.models import PasswordResetToken
from app.modules.auth.service import PASSWORD_RESET_GENERIC_MESSAGE, PASSWORD_RESET_INVALID_MESSAGE, hash_reset_token
from app.modules.users.models import User

engine = create_engine(
    'sqlite://',
    connect_args={'check_same_thread': False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)


@app.get('/__test__/active-user')
def active_user_endpoint(current_user: User = Depends(get_current_active_user)):
    return {'user_id': current_user.user_id, 'role': current_user.role}


@app.get('/__test__/admin-user')
def admin_user_endpoint(current_user: User = Depends(get_current_admin_user)):
    return {'user_id': current_user.user_id, 'role': current_user.role}


def setup_function():
    get_settings.cache_clear()
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    development_email_service.clear()


def create_test_user(*, email='customer@example.com', password='StrongPass1!', is_active=True, role='customer', phone='+94712345678'):
    with TestingSessionLocal() as db:
        user = User(
            full_name='Vestro Customer',
            email=email,
            phone=phone,
            hashed_password=hash_password(password),
            role=role,
            is_active=is_active,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user


def test_register_customer_creates_safe_user_response():
    response = client.post(
        '/api/v1/auth/register',
        json={
            'full_name': '  Vestro Customer  ',
            'email': 'CUSTOMER@EXAMPLE.COM',
            'phone': '+94 71 234 5678',
            'password': 'StrongPass1!',
        },
    )

    assert response.status_code == 201
    payload = response.json()
    assert payload['full_name'] == 'Vestro Customer'
    assert payload['email'] == 'customer@example.com'
    assert payload['phone'] == '+94712345678'
    assert payload['role'] == 'customer'
    assert payload['is_active'] is True
    assert payload['is_verified'] is False
    assert 'hashed_password' not in payload

    with TestingSessionLocal() as db:
        user = db.scalar(select(User).where(User.email == 'customer@example.com'))
        assert user is not None
        assert user.role == 'customer'
        assert user.hashed_password != 'StrongPass1!'


def test_register_rejects_duplicate_email():
    body = {
        'full_name': 'Vestro Customer',
        'email': 'customer@example.com',
        'phone': '0712345678',
        'password': 'StrongPass1!',
    }
    assert client.post('/api/v1/auth/register', json=body).status_code == 201

    response = client.post('/api/v1/auth/register', json={**body, 'phone': '0771234567'})

    assert response.status_code == 409
    assert response.json()['detail'] == 'An account with this email already exists.'


def test_register_rejects_duplicate_phone():
    assert client.post(
        '/api/v1/auth/register',
        json={
            'full_name': 'First Customer',
            'email': 'first@example.com',
            'phone': '0712345678',
            'password': 'StrongPass1!',
        },
    ).status_code == 201

    response = client.post(
        '/api/v1/auth/register',
        json={
            'full_name': 'Second Customer',
            'email': 'second@example.com',
            'phone': '0712345678',
            'password': 'StrongPass1!',
        },
    )

    assert response.status_code == 409
    assert response.json()['detail'] == 'An account with this phone number already exists.'


def test_register_validates_phone_and_password():
    response = client.post(
        '/api/v1/auth/register',
        json={
            'full_name': 'Vestro Customer',
            'email': 'customer@example.com',
            'phone': '12345',
            'password': 'weakpass',
        },
    )

    assert response.status_code == 422
    detail_text = str(response.json()['detail'])
    assert 'Sri Lankan mobile number' in detail_text
    assert 'uppercase letter' in detail_text


def test_login_success_returns_bearer_token_and_safe_user():
    user = create_test_user(email='customer@example.com', password='StrongPass1!')

    response = client.post(
        '/api/v1/auth/login',
        json={'email': ' CUSTOMER@EXAMPLE.COM ', 'password': 'StrongPass1!'},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload['access_token']
    assert payload['token_type'] == 'bearer'
    assert payload['user'] == {
        'user_id': user.user_id,
        'full_name': 'Vestro Customer',
        'email': 'customer@example.com',
        'phone': '+94712345678',
        'role': 'customer',
    }
    assert 'hashed_password' not in str(payload)


def test_login_rejects_invalid_password_with_generic_message():
    create_test_user(email='customer@example.com', password='StrongPass1!')

    response = client.post(
        '/api/v1/auth/login',
        json={'email': 'customer@example.com', 'password': 'WrongPass1!'},
    )

    assert response.status_code == 401
    assert response.json()['detail'] == 'Invalid email or password.'


def test_login_rejects_unknown_email_with_generic_message():
    response = client.post(
        '/api/v1/auth/login',
        json={'email': 'missing@example.com', 'password': 'StrongPass1!'},
    )

    assert response.status_code == 401
    assert response.json()['detail'] == 'Invalid email or password.'


def test_auth_me_requires_valid_bearer_token():
    create_test_user(email='customer@example.com', password='StrongPass1!')
    login_response = client.post(
        '/api/v1/auth/login',
        json={'email': 'customer@example.com', 'password': 'StrongPass1!'},
    )
    token = login_response.json()['access_token']

    response = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 200
    payload = response.json()
    assert payload['email'] == 'customer@example.com'
    assert payload['role'] == 'customer'
    assert 'hashed_password' not in payload


def test_auth_me_rejects_invalid_token():
    response = client.get('/api/v1/auth/me', headers={'Authorization': 'Bearer invalid-token'})

    assert response.status_code == 401
    assert response.json()['detail'] == 'Invalid authentication token.'


def test_auth_me_rejects_expired_token():
    settings = get_settings()
    expired_token = jwt.encode(
        {
            'sub': '1',
            'user_id': 1,
            'role': 'customer',
            'exp': datetime.now(timezone.utc) - timedelta(minutes=1),
        },
        settings.secret_key,
        algorithm=settings.algorithm,
    )

    response = client.get('/api/v1/auth/me', headers={'Authorization': f'Bearer {expired_token}'})

    assert response.status_code == 401
    assert response.json()['detail'] == 'Authentication token has expired.'

def test_active_user_dependency_rejects_unauthenticated_request():
    response = client.get('/__test__/active-user')

    assert response.status_code == 401


def test_active_user_dependency_allows_authenticated_customer():
    user = create_test_user(role='customer')
    token = create_access_token(user_id=user.user_id, role=user.role)

    response = client.get('/__test__/active-user', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 200
    assert response.json() == {'user_id': user.user_id, 'role': 'customer'}


def test_admin_dependency_rejects_authenticated_customer():
    user = create_test_user(role='customer')
    token = create_access_token(user_id=user.user_id, role=user.role)

    response = client.get('/__test__/admin-user', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 403
    assert response.json()['detail'] == 'Admin access is required.'


def test_admin_dependency_allows_admin_user():
    user = create_test_user(email='admin@example.com', role='admin', phone='+94771234567')
    token = create_access_token(user_id=user.user_id, role=user.role)

    response = client.get('/__test__/admin-user', headers={'Authorization': f'Bearer {token}'})

    assert response.status_code == 200
    assert response.json() == {'user_id': user.user_id, 'role': 'admin'}

def test_forgot_password_returns_generic_response_and_sends_development_email():
    create_test_user(email='customer@example.com', password='StrongPass1!')

    response = client.post('/api/v1/auth/forgot-password', json={'email': ' CUSTOMER@EXAMPLE.COM '})

    assert response.status_code == 200
    assert response.json() == {'message': PASSWORD_RESET_GENERIC_MESSAGE}
    assert len(development_email_service.outbox) == 1
    assert development_email_service.outbox[0].recipient == 'customer@example.com'
    assert development_email_service.outbox[0].reset_token not in response.text


def test_forgot_password_does_not_reveal_unknown_email():
    response = client.post('/api/v1/auth/forgot-password', json={'email': 'missing@example.com'})

    assert response.status_code == 200
    assert response.json() == {'message': PASSWORD_RESET_GENERIC_MESSAGE}
    assert development_email_service.outbox == []


def test_reset_password_with_valid_token_updates_password_and_marks_token_used():
    user = create_test_user(email='customer@example.com', password='OldPass1!')
    forgot_response = client.post('/api/v1/auth/forgot-password', json={'email': 'customer@example.com'})
    token = development_email_service.outbox[0].reset_token

    response = client.post(
        '/api/v1/auth/reset-password',
        json={'token': token, 'new_password': 'NewPassword@123'},
    )

    assert forgot_response.status_code == 200
    assert response.status_code == 200
    assert response.json() == {'message': 'Password has been reset successfully.'}

    with TestingSessionLocal() as db:
        db_user = db.get(User, user.user_id)
        reset_token = db.scalar(select(PasswordResetToken).where(PasswordResetToken.hashed_token == hash_reset_token(token)))
        assert verify_password('NewPassword@123', db_user.hashed_password)
        assert not verify_password('OldPass1!', db_user.hashed_password)
        assert reset_token.used_at is not None


def test_reset_password_rejects_invalid_token():
    response = client.post(
        '/api/v1/auth/reset-password',
        json={'token': 'invalid-reset-token-value', 'new_password': 'NewPassword@123'},
    )

    assert response.status_code == 400
    assert response.json()['detail'] == PASSWORD_RESET_INVALID_MESSAGE


def test_reset_password_rejects_expired_token():
    user = create_test_user(email='customer@example.com', password='OldPass1!')
    raw_token = 'expired-reset-token-value'

    with TestingSessionLocal() as db:
        db.add(
            PasswordResetToken(
                user_id=user.user_id,
                hashed_token=hash_reset_token(raw_token),
                expires_at=datetime.now(timezone.utc) - timedelta(minutes=1),
            )
        )
        db.commit()

    response = client.post(
        '/api/v1/auth/reset-password',
        json={'token': raw_token, 'new_password': 'NewPassword@123'},
    )

    assert response.status_code == 400
    assert response.json()['detail'] == PASSWORD_RESET_INVALID_MESSAGE


def test_reset_password_rejects_reused_token():
    create_test_user(email='customer@example.com', password='OldPass1!')
    client.post('/api/v1/auth/forgot-password', json={'email': 'customer@example.com'})
    token = development_email_service.outbox[0].reset_token

    first_response = client.post(
        '/api/v1/auth/reset-password',
        json={'token': token, 'new_password': 'NewPassword@123'},
    )
    second_response = client.post(
        '/api/v1/auth/reset-password',
        json={'token': token, 'new_password': 'AnotherPass@123'},
    )

    assert first_response.status_code == 200
    assert second_response.status_code == 400
    assert second_response.json()['detail'] == PASSWORD_RESET_INVALID_MESSAGE
