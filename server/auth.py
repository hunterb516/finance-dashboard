from passlib.context import CryptContext

# Use PBKDF2-SHA256 to avoid bcrypt backend issues
pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")

def _normalize(plain: str | bytes) -> str:
    if plain is None:
        return ""
    if isinstance(plain, bytes):
        plain = plain.decode("utf-8", errors="ignore")
    # Some hashers (like bcrypt) limit to 72 bytes; we keep this slice for parity/safety
    return plain[:72]

def hash_password(plain_password: str | bytes) -> str:
    """
    Return a password hash suitable for storing in DB.
    """
    norm = _normalize(plain_password)
    if not norm:
        raise ValueError("Password is required")
    return pwd_context.hash(norm)

def verify_password(plain_password: str | bytes, hashed_password: str | bytes) -> bool:
    """
    Verify a plain password against a stored hash. Returns True/False.
    """
    if not hashed_password:
        return False
    norm = _normalize(plain_password)
    if isinstance(hashed_password, bytes):
        hashed_password = hashed_password.decode("utf-8", errors="ignore")
    try:
        return pwd_context.verify(norm, hashed_password)
    except Exception:
        return False

# Optional alias (if any code imports this name)
def get_password_hash(plain_password: str | bytes) -> str:
    return hash_password(plain_password)
