"""update users model

Revision ID: 20260723_0003
Revises: 20260721_0002
Create Date: 2026-07-23
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = '20260723_0003'
down_revision: str | None = '20260721_0002'
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    bind = op.get_bind()
    dialect_name = bind.dialect.name

    with op.batch_alter_table('users') as batch_op:
        batch_op.alter_column('user_id', new_column_name='id', existing_type=sa.Integer())
        batch_op.add_column(sa.Column('username', sa.String(length=30), nullable=True))
        batch_op.add_column(sa.Column('nic_number', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('password_hash', sa.String(length=255), nullable=True))
        batch_op.add_column(sa.Column('profile_completed', sa.Boolean(), server_default='false', nullable=False))

    op.execute(sa.text('UPDATE users SET password_hash = hashed_password'))

    if dialect_name == 'postgresql':
        op.execute(
            sa.text(
                """
                UPDATE users
                SET username = 'user_' || id::text
                WHERE username IS NULL
                """
            )
        )
        op.execute(
            sa.text(
                """
                UPDATE users
                SET nic_number = COALESCE(phone, 'NIC-' || id::text)
                WHERE nic_number IS NULL
                """
            )
        )
    else:
        op.execute(sa.text("UPDATE users SET username = 'user_' || id WHERE username IS NULL"))
        op.execute(sa.text("UPDATE users SET nic_number = COALESCE(phone, 'NIC-' || id) WHERE nic_number IS NULL"))

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('ck_users_role_valid', type_='check')
        batch_op.drop_constraint('uq_users_phone', type_='unique')
        batch_op.alter_column('username', existing_type=sa.String(length=30), nullable=False)
        batch_op.alter_column('nic_number', existing_type=sa.String(length=20), nullable=False)
        batch_op.alter_column('password_hash', existing_type=sa.String(length=255), nullable=False)
        batch_op.drop_column('phone')
        batch_op.drop_column('hashed_password')
        batch_op.create_check_constraint('ck_users_role_valid', "role IN ('customer', 'designer', 'admin')")

    op.create_index('ix_users_username', 'users', ['username'], unique=True)
    op.create_index('ix_users_nic_number', 'users', ['nic_number'], unique=True)


def downgrade() -> None:
    bind = op.get_bind()
    dialect_name = bind.dialect.name

    with op.batch_alter_table('users') as batch_op:
        batch_op.add_column(sa.Column('phone', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('hashed_password', sa.String(length=255), nullable=True))

    op.execute(sa.text('UPDATE users SET hashed_password = password_hash'))

    if dialect_name == 'postgresql':
        op.execute(sa.text("UPDATE users SET phone = NULLIF(nic_number, 'NIC-' || id::text)"))
    else:
        op.execute(sa.text("UPDATE users SET phone = CASE WHEN nic_number = 'NIC-' || id THEN NULL ELSE nic_number END"))

    op.drop_index('ix_users_nic_number', table_name='users')
    op.drop_index('ix_users_username', table_name='users')

    with op.batch_alter_table('users') as batch_op:
        batch_op.drop_constraint('ck_users_role_valid', type_='check')
        batch_op.alter_column('hashed_password', existing_type=sa.String(length=255), nullable=False)
        batch_op.drop_column('profile_completed')
        batch_op.drop_column('password_hash')
        batch_op.drop_column('nic_number')
        batch_op.drop_column('username')
        batch_op.alter_column('id', new_column_name='user_id', existing_type=sa.Integer())
        batch_op.create_check_constraint('ck_users_role_valid', "role IN ('customer', 'admin')")
        batch_op.create_unique_constraint('uq_users_phone', ['phone'])
