"""create users table

Revision ID: 20260721_0001
Revises:
Create Date: 2026-07-21
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = '20260721_0001'
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('user_id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('full_name', sa.String(length=120), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), server_default='customer', nullable=False),
        sa.Column('is_active', sa.Boolean(), server_default='true', nullable=False),
        sa.Column('is_verified', sa.Boolean(), server_default='false', nullable=False),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.CheckConstraint("role IN ('customer', 'admin')", name='ck_users_role_valid'),
        sa.PrimaryKeyConstraint('user_id'),
        sa.UniqueConstraint('phone', name='uq_users_phone'),
    )
    op.create_index('ix_users_email', 'users', ['email'], unique=True)


def downgrade() -> None:
    op.drop_index('ix_users_email', table_name='users')
    op.drop_table('users')