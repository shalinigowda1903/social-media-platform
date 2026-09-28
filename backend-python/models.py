from sqlalchemy import Column, Integer, String, Text, Date, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


# =========================
# USER MODEL
# =========================

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False)
    password = Column(String(255), nullable=False)

    social_accounts = relationship(
        "SocialAccount",
        back_populates="user",
        cascade="all, delete"
    )

    campaigns = relationship(
        "Campaign",
        back_populates="user",
        cascade="all, delete"
    )


# =========================
# SOCIAL ACCOUNT MODEL
# =========================

class SocialAccount(Base):
    __tablename__ = "social_accounts"

    account_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    platform = Column(String(50), nullable=False)
    username = Column(String(255), nullable=False)

    user = relationship(
        "User",
        back_populates="social_accounts"
    )

    posts = relationship(
        "Post",
        back_populates="account",
        cascade="all, delete"
    )


# =========================
# CAMPAIGN MODEL
# =========================

class Campaign(Base):
    __tablename__ = "campaigns"

    campaign_id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.user_id"),
        nullable=False
    )

    campaign_name = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default="draft")

    start_date = Column(Date)
    end_date = Column(Date)

    user = relationship(
        "User",
        back_populates="campaigns"
    )

    posts = relationship(
        "Post",
        back_populates="campaign",
        cascade="all, delete"
    )


# =========================
# POST MODEL
# =========================

class Post(Base):
    __tablename__ = "posts"

    post_id = Column(Integer, primary_key=True, index=True)

    campaign_id = Column(
        Integer,
        ForeignKey("campaigns.campaign_id"),
        nullable=False
    )

    account_id = Column(
        Integer,
        ForeignKey("social_accounts.account_id"),
        nullable=False
    )

    content = Column(Text, nullable=False)

    media_url = Column(String(500))

    scheduled_time = Column(DateTime)

    status = Column(
        String(50),
        default="draft"
    )

    campaign = relationship(
        "Campaign",
        back_populates="posts"
    )

    account = relationship(
        "SocialAccount",
        back_populates="posts"
    )