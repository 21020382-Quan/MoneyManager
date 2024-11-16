"""data pairing

Revision ID: 7cf959abb9de
Revises: 7136417638be
Create Date: 2024-11-14 22:39:14.640180

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
import sqlmodel


# revision identifiers, used by Alembic.
revision: str = '7cf959abb9de'
down_revision: Union[str, None] = '7136417638be'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('budget', sa.Column('totalSpent', sa.Integer(), nullable=True))
    op.drop_column('budget', 'total_spent')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('budget', sa.Column('total_spent', sa.INTEGER(), autoincrement=False, nullable=True))
    op.drop_column('budget', 'totalSpent')
    # ### end Alembic commands ###
