"""config data in table

Revision ID: a650aa63c0e7
Revises: ee1514bb181c
Create Date: 2024-10-31 15:13:00.098790

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a650aa63c0e7'
down_revision: Union[str, None] = 'ee1514bb181c'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction', sa.Column('amount', sa.Integer(), nullable=True))
    op.create_foreign_key(None, 'transaction', 'user', ['user_id'], ['id'])
    op.drop_column('transaction', 'wallet_id')
    op.drop_column('transaction', 'is_notified')
    op.drop_column('transaction', 'image')
    op.drop_column('transaction', 'category_id')
    op.drop_column('transaction', 'value')
    op.drop_column('transaction', 'name')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('transaction', sa.Column('name', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('transaction', sa.Column('value', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('transaction', sa.Column('category_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.add_column('transaction', sa.Column('image', sa.VARCHAR(), autoincrement=False, nullable=False))
    op.add_column('transaction', sa.Column('is_notified', sa.BOOLEAN(), autoincrement=False, nullable=False))
    op.add_column('transaction', sa.Column('wallet_id', sa.INTEGER(), autoincrement=False, nullable=False))
    op.drop_constraint(None, 'transaction', type_='foreignkey')
    op.drop_column('transaction', 'amount')
    # ### end Alembic commands ###