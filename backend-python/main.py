from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date, datetime

import models
import auth
from database import engine, get_db


# ==========================================
# CREATE FASTAPI APPLICATION
# ==========================================

app = FastAPI(
    title="Intelligent Social Media Platform",
    version="1.0.0",
    description="Social Media Scheduling and Multi-Platform Campaign Management API"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# CREATE TABLES
# ==========================================

models.Base.metadata.create_all(bind=engine)


# ==========================================
# REQUEST MODELS
# ==========================================

class LoginRequest(BaseModel):
    email: str
    password: str


class SocialAccountCreate(BaseModel):
    platform: str
    username: str


class CampaignCreate(BaseModel):
    campaign_name: str
    description: Optional[str] = None
    status: str = "draft"
    start_date: Optional[date] = None
    end_date: Optional[date] = None


class PostCreate(BaseModel):
    campaign_id: int
    account_id: int
    content: str
    media_url: Optional[str] = None
    scheduled_time: Optional[datetime] = None


# ==========================================
# HOME
# ==========================================

@app.get("/")
def home():
    return {
        "message": "Python Backend is Working!"
    }


# ==========================================
# HEALTH
# ==========================================

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }


# ==========================================
# LOGIN
# ==========================================

@app.post("/api/users/login")
def login(
    login_data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = (
        db.query(models.User)
        .filter(
            models.User.email == login_data.email
        )
        .first()
    )

    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    try:
        password_valid = auth.verify_password(
            login_data.password,
            user.password
        )
    except Exception as error:
        print("Password verification error:", error)

        raise HTTPException(
            status_code=500,
            detail="Password verification error"
        )

    if not password_valid:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    token = auth.create_access_token(
        user.user_id
    )

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "user_id": user.user_id,
            "email": user.email
        }
    }


# ==========================================
# SOCIAL ACCOUNTS - GET
# ==========================================

@app.get("/api/social-accounts")
def get_social_accounts(
    db: Session = Depends(get_db)
):

    accounts = db.query(models.SocialAccount).all()

    return {
        "accounts": [
            {
                "account_id": account.account_id,
                "user_id": account.user_id,
                "platform": account.platform,
                "username": account.username
            }
            for account in accounts
        ]
    }


# ==========================================
# SOCIAL ACCOUNTS - CREATE
# ==========================================

@app.post("/api/social-accounts")
def create_social_account(
    account_data: SocialAccountCreate,
    db: Session = Depends(get_db)
):

    account = models.SocialAccount(
        user_id=1,
        platform=account_data.platform,
        username=account_data.username
    )

    db.add(account)
    db.commit()
    db.refresh(account)

    return {
        "message": "Social account created successfully",
        "account": {
            "account_id": account.account_id,
            "platform": account.platform,
            "username": account.username
        }
    }


# ==========================================
# SOCIAL ACCOUNTS - DELETE
# ==========================================

@app.delete("/api/social-accounts/{account_id}")
def delete_social_account(
    account_id: int,
    db: Session = Depends(get_db)
):

    account = (
        db.query(models.SocialAccount)
        .filter(
            models.SocialAccount.account_id == account_id
        )
        .first()
    )

    if account is None:
        raise HTTPException(
            status_code=404,
            detail="Social account not found"
        )

    db.delete(account)
    db.commit()

    return {
        "message": "Social account deleted successfully"
    }


# ==========================================
# CAMPAIGNS - GET
# ==========================================

@app.get("/api/campaigns")
def get_campaigns(
    db: Session = Depends(get_db)
):

    campaigns = db.query(models.Campaign).all()

    return {
        "campaigns": [
            {
                "campaign_id": campaign.campaign_id,
                "user_id": campaign.user_id,
                "campaign_name": campaign.campaign_name,
                "description": campaign.description,
                "status": campaign.status,
                "start_date": campaign.start_date,
                "end_date": campaign.end_date
            }
            for campaign in campaigns
        ]
    }


# ==========================================
# CAMPAIGNS - CREATE
# ==========================================

@app.post("/api/campaigns")
def create_campaign(
    campaign_data: CampaignCreate,
    db: Session = Depends(get_db)
):

    campaign = models.Campaign(
        user_id=1,
        campaign_name=campaign_data.campaign_name,
        description=campaign_data.description,
        status=campaign_data.status,
        start_date=campaign_data.start_date,
        end_date=campaign_data.end_date
    )

    db.add(campaign)
    db.commit()
    db.refresh(campaign)

    return {
        "message": "Campaign created successfully",
        "campaign": {
            "campaign_id": campaign.campaign_id,
            "campaign_name": campaign.campaign_name,
            "description": campaign.description,
            "status": campaign.status,
            "start_date": campaign.start_date,
            "end_date": campaign.end_date
        }
    }


# ==========================================
# POSTS - GET
# ==========================================

@app.get("/api/posts")
def get_posts(
    db: Session = Depends(get_db)
):

    posts = db.query(models.Post).all()

    result = []

    for post in posts:

        campaign = (
            db.query(models.Campaign)
            .filter(
                models.Campaign.campaign_id
                == post.campaign_id
            )
            .first()
        )

        account = (
            db.query(models.SocialAccount)
            .filter(
                models.SocialAccount.account_id
                == post.account_id
            )
            .first()
        )

        result.append({
            "post_id": post.post_id,
            "campaign_id": post.campaign_id,
            "account_id": post.account_id,
            "content": post.content,
            "media_url": post.media_url,
            "scheduled_time": post.scheduled_time,
            "status": post.status,
            "campaign_name": (
                campaign.campaign_name
                if campaign else None
            ),
            "platform": (
                account.platform
                if account else None
            ),
            "username": (
                account.username
                if account else None
            )
        })

    return {
        "posts": result
    }


# ==========================================
# POSTS - CREATE
# ==========================================

@app.post("/api/posts")
def create_post(
    post_data: PostCreate,
    db: Session = Depends(get_db)
):

    campaign = (
        db.query(models.Campaign)
        .filter(
            models.Campaign.campaign_id
            == post_data.campaign_id
        )
        .first()
    )

    if campaign is None:
        raise HTTPException(
            status_code=404,
            detail="Campaign not found"
        )

    account = (
        db.query(models.SocialAccount)
        .filter(
            models.SocialAccount.account_id
            == post_data.account_id
        )
        .first()
    )

    if account is None:
        raise HTTPException(
            status_code=404,
            detail="Social account not found"
        )

    post_status = "scheduled"

    if post_data.scheduled_time is None:
        post_status = "draft"

    post = models.Post(
        campaign_id=post_data.campaign_id,
        account_id=post_data.account_id,
        content=post_data.content,
        media_url=post_data.media_url,
        scheduled_time=post_data.scheduled_time,
        status=post_status
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "message": "Post created successfully",
        "post": {
            "post_id": post.post_id,
            "campaign_id": post.campaign_id,
            "account_id": post.account_id,
            "content": post.content,
            "media_url": post.media_url,
            "scheduled_time": post.scheduled_time,
            "status": post.status
        }
    }