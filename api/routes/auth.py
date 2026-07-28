from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import hashlib
from database.database_manager import DatabaseManager

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


class SignupRequest(BaseModel):
    full_name: str
    email: str
    password: str
    phone: str
    dob: str = None


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


@router.post("/login")
def login(data: LoginRequest):
    user = DatabaseManager.login_user(data.email, hash_password(data.password))
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "success": True,
        "user": {
            "id": user["id"],
            "full_name": user["full_name"],
            "email": user["email"],
            "phone": user.get("phone", "")
        }
    }


@router.post("/signup")
def signup(data: SignupRequest):
    existing = DatabaseManager.fetch_one(
        "SELECT id FROM users WHERE email=%s", (data.email,)
    )
    if existing:
        raise HTTPException(status_code=400, detail="Account with this email already exists")

    ok = DatabaseManager.register_user(
        data.full_name, data.email, hash_password(data.password), data.phone, data.dob
    )
    if not ok:
        raise HTTPException(status_code=500, detail="Failed to register user")

    user = DatabaseManager.login_user(data.email, hash_password(data.password))
    return {
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": user["id"] if user else 1,
            "full_name": data.full_name,
            "email": data.email
        }
    }
