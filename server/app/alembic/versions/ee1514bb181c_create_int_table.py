"""create int table

Revision ID: ee1514bb181c
Revises: 05b87ca632ca
Create Date: 2024-10-28 15:37:24.520267

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
import sqlmodel

# revision identifiers, used by Alembic.
revision: str = 'ee1514bb181c'
down_revision: Union[str, None] = '05b87ca632ca'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('budget',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('icon', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('name', sqlmodel.sql.sqltypes.AutoString(), nullable=False),
    sa.Column('amount', sa.Integer(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.drop_index('ix_category_user_name', table_name='category')
    op.drop_table('category')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('category',
    sa.Column('user_name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('category_name', sa.VARCHAR(), autoincrement=False, nullable=False),
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('created_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.Column('updated_at', postgresql.TIMESTAMP(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='category_pkey')
    )
    op.create_index('ix_category_user_name', 'category', ['user_name'], unique=False)
    op.drop_table('budget')
    # ### end Alembic commands ###