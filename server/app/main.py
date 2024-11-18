from fastapi import FastAPI, HTTPException
# import jwt
from fastapi.routing import APIRoute

from fastapi.middleware.cors import CORSMiddleware


from api.main import api_router
from core.config import settings
# from app.models.users import Login


# SECURITY_ALGORITHM = 'HS256'
# SECRET_KEY = '123456'

def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
    root_path=settings.ROOT_PATH,
)


# def verify_password(email, password):
#     if email == 'admin' and password == 'admin':
#         return True
#     return False

# def generate_token(email: Union[str, Any]) -> str:
#     expire = datetime.utcnow() + timedelta(
#         seconds=60 * 60 * 24 * 3  
#     )
#     to_encode = {
#         "exp": expire, "email": email
#     }
#     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=SECURITY_ALGORITHM)
#     return encoded_jwt

# @app.post('/login', name="Login", tags=["Login"])
# def login(request_data: Login):
#     print(f'[x] request_data: {request_data.__dict__}')
#     if verify_password(email=request_data.email, password=request_data.password):
#         token = generate_token(request_data.email)
#         return {
#             'token': token
#         }
#     else:
#         raise HTTPException(status_code=404, detail="User not found")

@app.get("/", name="Health", tags=["Health"])
def check_health():
    return {
        "health": "ok",
    }

origins = [
    "http://localhost:3000",
    "http://localhost:8081",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# if settings.BACKEND_CORS_ORIGINS:
#     app.add_middleware(
#         CORSMiddleware,
#         allow_origins=["*"],
#         allow_credentials=True,
#         allow_methods=["*"],
#         allow_headers=["*"],
#     )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)