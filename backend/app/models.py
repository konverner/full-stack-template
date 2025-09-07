"""Shared models and mixins for the Dispatch application."""

from datetime import datetime, timezone

from pydantic import Field, StringConstraints

from sqlalchemy import Column, DateTime, Integer, event, ForeignKey
from sqlalchemy.orm import declared_attr, declarative_base, relationship
from typing_extensions import Annotated

# pydantic type that limits the range of primary keys
PrimaryKey = Annotated[int, Field(gt=0, lt=2147483647)]
NameStr = Annotated[
    str, StringConstraints(pattern=r".*\S.*", strip_whitespace=True, min_length=3)
]
OrganizationSlug = Annotated[
    str, StringConstraints(pattern=r"^[\w]+(?:_[\w]+)*$", min_length=3)
]

Base = declarative_base()


# SQLAlchemy models...
class ProjectMixin(object):
    """Project mixin for adding project relationships to models."""

    @declared_attr
    def project_id(cls):  # noqa
        """Returns the project_id column."""
        return Column(Integer, ForeignKey("project.id", ondelete="CASCADE"))

    @declared_attr
    def project(cls):
        """Returns the project relationship."""
        return relationship("Project")


class TimeStampMixin(object):
    """Timestamping mixin for created_at and updated_at fields."""

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    created_at._creation_order = 9998
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at._creation_order = 9998

    @staticmethod
    def _updated_at(mapper, connection, target):
        """Updates the updated_at field to the current UTC time."""
        target.updated_at = datetime.now(timezone.utc)

    @classmethod
    def __declare_last__(cls):
        """Registers the before_update event to update the updated_at field."""
        event.listen(cls, "before_update", cls._updated_at)
