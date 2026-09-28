from dataclasses import dataclass
from datetime import datetime, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy import MetaData, Table, func, insert, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import decode_access_token, verify_password, get_password_hash
from app.schemas.auth import RegisterRequest

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

@dataclass
class AuthUser:
    id: int
    name: str
    email: str
    role: str
    avatar_url: Optional[str]
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None


def _users_table(db: Session) -> Table:
    return Table("users", MetaData(), autoload_with=db.get_bind())


def _id_column(users: Table):
    column = users.c.get("id")
    if column is None:
        column = users.c.get("user_id")
    if column is None:
        raise RuntimeError("The users table has no supported ID column.")
    return column


def _password_column(users: Table):
    column = users.c.get("hashed_password")
    if column is None:
        column = users.c.get("password")
    if column is None:
        raise RuntimeError("The users table has no supported password column.")
    return column


def _user_from_row(users: Table, row, role: Optional[str] = None) -> AuthUser:
    email = row["email"]
    name = row.get("name") or email.split("@", 1)[0]
    return AuthUser(
        id=int(row[_id_column(users).name]),
        name=name,
        email=email,
        role=row.get("role") or role or "Admin",
        avatar_url=row.get("avatar_url") or f"https://api.dicebear.com/7.x/avataaars/svg?seed={name.replace(' ', '')}",
        is_active=row.get("is_active", True),
        created_at=row.get("created_at") or datetime.now(timezone.utc),
        updated_at=row.get("updated_at"),
    )


def _find_user(db: Session, users: Table, email: Optional[str] = None, user_id: Optional[int] = None):
    statement = select(users)
    if email is not None:
        statement = statement.where(func.lower(users.c.email) == email.lower().strip())
    elif user_id is not None:
        statement = statement.where(_id_column(users) == user_id)
    else:
        statement = statement.limit(1)
    return db.execute(statement).mappings().first()


def authenticate_user(db: Session, email: str, password: str) -> Optional[AuthUser]:
    users = _users_table(db)
    row = _find_user(db, users, email=email)
    if not row or not verify_password(password, row[_password_column(users).name]):
        return None
    return _user_from_row(users, row)

def create_user(db: Session, user_in: RegisterRequest) -> AuthUser:
    users = _users_table(db)
    email = user_in.email.lower().strip()
    existing = _find_user(db, users, email=email)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )

    values = {
        "email": email,
        _password_column(users).key: get_password_hash(user_in.password),
    }
    if "name" in users.c:
        values[users.c.name.key] = user_in.name.strip()
    if "role" in users.c:
        values[users.c.role.key] = user_in.role or "Admin"
    if "avatar_url" in users.c:
        values[users.c.avatar_url.key] = f"https://api.dicebear.com/7.x/avataaars/svg?seed={user_in.name.replace(' ', '')}"
    if "created_at" in users.c:
        values[users.c.created_at.key] = datetime.now(timezone.utc)
    if "is_active" in users.c:
        values[users.c.is_active.key] = True
    if "updated_at" in users.c:
        values[users.c.updated_at.key] = datetime.now(timezone.utc)

    try:
        result = db.execute(insert(users).values(values))
        db.commit()
    except IntegrityError as error:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        ) from error

    user_id = result.inserted_primary_key[0]
    row = _find_user(db, users, user_id=user_id)
    if row is None:
        raise RuntimeError("The account was created but could not be loaded.")
    return _user_from_row(users, row, role=user_in.role or "Admin")

def get_current_user(
    db: Session = Depends(get_db),
    token: Optional[str] = Depends(oauth2_scheme)
) -> AuthUser:
    users = _users_table(db)

    if token:
        payload = decode_access_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired authentication token."
            )
        try:
            user_id = int(payload["sub"])
        except (TypeError, ValueError):
            user_id = -1
        row = _find_user(db, users, user_id=user_id)
        if row:
            return _user_from_row(users, row)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User associated with token does not exist."
        )

    row = _find_user(db, users)
    if row:
        return _user_from_row(users, row)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication credentials were not provided."
    )
