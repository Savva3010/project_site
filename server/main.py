from fastapi import FastAPI, WebSocket, Depends, UploadFile, File, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, validator
from typing import List, Optional, Union, Literal
from datetime import datetime, timedelta
import sqlite3
import os
import uuid
import jwt
import secrets
import json
from passlib.context import CryptContext
import asyncio

app = FastAPI()

SECRET_KEY = secrets.token_urlsafe(64)
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

active_connections = set()
connections_lock = asyncio.Lock()

async def broadcast_message(message: dict):
    async with connections_lock:
        for connection in list(active_connections):
            try:
                await connection.send_json(message)
            except:
                await connection.close()
                active_connections.remove(connection)

@app.websocket("/")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    async with connections_lock:
        active_connections.add(websocket)

    heartbeat_task = asyncio.create_task(send_heartbeats(websocket))

    try:
        while True:
            data = await websocket.receive_json()
            if data.get("op") == "ping":
                await websocket.send_json({"op": "pong"})
    except WebSocketDisconnect:
        heartbeat_task.cancel()
        async with connections_lock:
            active_connections.remove(websocket)

async def send_heartbeats(websocket: WebSocket):
    try:
        while True:
            await asyncio.sleep(120)  # Send ping every 2 minutes
            await websocket.send_json({"op": "ping"})
    except asyncio.CancelledError:
        pass

def format_date(date_str: str) -> str:
    month_map = {
        "ЯНВ": "января",
        "ФЕВ": "февраля",
        "МАР": "марта",
        "АПР": "апреля",
        "МАЙ": "мая",
        "ИЮН": "июня",
        "ИЮЛ": "июля",
        "АВГ": "августа",
        "СЕН": "сентября",
        "ОКТ": "октября",
        "НОЯ": "ноября",
        "ДЕК": "декабря"
    }

    try:
        day_part, month_part = date_str.split()
        formatted_month = month_map.get(month_part, month_part.lower())
        return f"{day_part} {formatted_month}"
    except ValueError:
        return date_str


def init_db():
    conn = sqlite3.connect('internat.db')
    c = conn.cursor()

    c.execute('''CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        hashed_password TEXT,
        salt TEXT,
        full_name TEXT,
        disabled BOOLEAN DEFAULT FALSE
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS residents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        age INTEGER NOT NULL,
        room TEXT NOT NULL,
        class_name TEXT NOT NULL,
        class_teacher TEXT NOT NULL,
        class_mentor TEXT NOT NULL,
        mobile TEXT NOT NULL,
        email TEXT,
        telegram TEXT,
        status_type TEXT NOT NULL,
        status_place TEXT,
        status_until INTEGER,
        parents_json TEXT NOT NULL,
        profile_image TEXT,
        blur_hash TEXT,
        comments TEXT,
        warnings TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        content TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS warns (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        author TEXT NOT NULL,
        content TEXT
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS applications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resident_id INTEGER NOT NULL,
        leave_ts INTEGER NOT NULL,
        return_ts INTEGER NOT NULL,
        address TEXT NOT NULL,
        accompany TEXT,
        status TEXT CHECK(status IN ('review', 'denied', 'cancelled', 'accepted')),
        comment TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(resident_id) REFERENCES residents(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS application_files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        application_id INTEGER NOT NULL,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL,
        blur_hash TEXT,
        FOREIGN KEY(application_id) REFERENCES applications(id)
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS cleaning_dates (
        date TEXT PRIMARY KEY
    )''')

    c.execute('''CREATE TABLE IF NOT EXISTS cleaning_marks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        room TEXT,
        mark INTEGER,
        UNIQUE(date, room),
        FOREIGN KEY(date) REFERENCES cleaning_dates(date)
    )''')
    
    c.execute('''CREATE TABLE IF NOT EXISTS leave_journal (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        resident_id INTEGER NOT NULL,
        application_id INTEGER REFERENCES applications(id),
        leave_time INTEGER NOT NULL,
        leave_marked INTEGER,
        return_time INTEGER NOT NULL,
        return_marked INTEGER,
        address TEXT NOT NULL,
        status TEXT CHECK(status IN ('inside', 'school', 'outside', 'returned')) NOT NULL DEFAULT 'inside',
        type TEXT CHECK(type IN ('self', 'application')) NOT NULL,
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(resident_id) REFERENCES residents(id)
    )''')

    c.execute('CREATE INDEX IF NOT EXISTS idx_residents_room ON residents(room)')
    c.execute('CREATE INDEX IF NOT EXISTS idx_marks_date ON cleaning_marks(date)')

    conn.commit()
    conn.close()

init_db()

class BaseResponse(BaseModel):
    success: bool
    data: Union[dict, list]

def error_response(message: str, error_id: str, status_code: int = 400):
    raise HTTPException(
        status_code=status_code,
        detail={
            "success": False,
            "data": {
                "message": message,
                "error_id": error_id
            }
        }
    )

class UserCreate(BaseModel):
    username: str
    password: str
    full_name: str

class UserLogin(BaseModel):
    username: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProfileResponse(BaseModel):
    name: str
    surname: str
    lastname: str

class Parent(BaseModel):
    full_name: str
    mobile: str
    email: Optional[str] = None
    telegram: Optional[str] = None

class Note(BaseModel):
    id: int
    content: str

class Warn(BaseModel):
    id: int
    created_at: str
    author: str
    content: str

class ResidentStatus(BaseModel):
    status: str
    place: Optional[str] = None
    until: Optional[int] = None

class ResidentCreate(BaseModel):
    full_name: str
    age: int
    room: str
    class_name: str = Field(alias="class")
    class_teacher: str
    class_mentor: str
    mobile: str
    email: Optional[str] = None
    telegram: Optional[str] = None
    status: ResidentStatus
    parents: List[Parent]
    profile_image: Optional[str] = None
    blur_hash: Optional[str] = 'default'
    comments: List[Note] = []
    warnings: List[Warn] = []

class NotesCreate(BaseModel):
    content: str
    
class NotesDelete(BaseModel):
    id: int

class WarnsDelete(BaseModel):
    id: int

class ApplicationStatusUpdate(BaseModel):
    status: str

class ApplicationComment(BaseModel):
    content: str

class ApplicationCreate(BaseModel):
    resident_id: int
    leave_ts: int = Field(alias="leave_time")
    return_ts: int = Field(alias="return_time")
    address: str
    accompany: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    resident_id: int
    status: str
    created_at: str

class CleaningDateRequest(BaseModel):
    day: int
    month: int

class CleaningDateDelete(BaseModel):
    date: str

class CleaningMarkUpdate(BaseModel):
    date: str
    room: str
    mark: int

class ResidentResponse(BaseModel):
    id: int
    profile_image: dict = {
        "src": "",
        "blur_hash": ""
    }
    full_name: str
    age: int
    room: str
    class_name: str = Field(alias="class")
    class_teacher: str
    class_mentor: str
    mobile: str
    status: dict
    parents: list

class LeaveEntry(BaseModel):
    id: int
    resident_id: int
    full_name: str
    class_name: str = Field(alias="class")
    room: str
    leave: int
    leave_marked: Optional[int] = None
    return_time: int
    return_marked: Optional[int] = None
    address: str
    status: str
    type: str

class LeaveDetail(LeaveEntry):
    resident: ResidentResponse
    comment: Optional[str] = None
    application_id: Optional[int] = None
    created_at: str

class LeaveStatusUpdate(BaseModel):
    status: Literal['inside', 'outside', 'returned']

class LeaveCreate(BaseModel):
    type: Literal['self', 'application']
    resident_id: int
    leave_time: Optional[int]
    return_time: Optional[int]
    address: Optional[str]
    application_id: Optional[int] = None

    @validator('application_id')
    def check_application(cls, v, values):
        if values['type'] == 'application' and not v:
            raise ValueError('application_id required for application type')
        return v

class CommentCreate(BaseModel):
    content: str

    class Config:
        orm_mode = True

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_db():
    conn = sqlite3.connect('internat.db')
    conn.row_factory = sqlite3.Row
    return conn

def create_access_token(data: dict):
    expires = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    data.update({"exp": expires})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password: str, salt: str, hashed_password: str):
    pepper = os.getenv("PEPPER", "default_pepper")
    return pwd_context.verify(plain_password + salt + pepper, hashed_password)

def authenticate_user(username: str, password: str):
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    db.close()

    if not user or not verify_password(password, user['salt'], user['hashed_password']):
        return None
    return user

async def get_current_user(token: str = Depends(oauth2_scheme)):
    username = ""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if not username:
            error_response("Неправильный токен", "BAD_TOKEN", 401)
    except jwt.PyJWTError:
        error_response("Неправильный токен", "BAD_TOKEN", 401)
        
    db = get_db()
    user = db.execute("SELECT * FROM users WHERE username = ?", (username,)).fetchone()
    db.close()
    
    if not user:
        error_response("Пользователь не найден", "USER_NOT_FOUND", 401)
    
    return dict(user)

@app.post("/register", response_model=BaseResponse)
async def register(user: UserCreate):
    salt = secrets.token_hex(16)
    pepper = os.getenv("PEPPER", "default_pepper")
    hashed = pwd_context.hash(user.password + salt + pepper)

    conn = None
    try:
        conn = get_db()
        conn.execute(
            "INSERT INTO users (username, hashed_password, salt, full_name) VALUES (?, ?, ?, ?)",
            (user.username, hashed, salt, user.full_name)
        )
        conn.commit()

        return {
            "success": True,
            "data": {
                "access_token": create_access_token({"sub": user.username}),
                "token_type": "bearer"
            }
        }

    except sqlite3.IntegrityError:
        return error_response("На данное имя уже зарегистрирован пользователь", "DOUBLE_REGISTRATION", 400)

    except Exception:
        return error_response("Ошибка сервера", "SERVER_ERROR", 500)

    finally:
        if conn:
            conn.close()

@app.post("/token", response_model=BaseResponse)
async def login(user: UserLogin):
    authenticated_user = authenticate_user(user.username, user.password)
    if not authenticated_user:
        return error_response("Неправильный логин или пароль", "AUTH_ERROR", 401)

    return {
        "success": True,
        "data": {
            "access_token": create_access_token({"sub": user.username}),
            "token_type": "bearer"
        }
    }

@app.get("/profile", response_model=BaseResponse)
async def get_profile(current_user: dict = Depends(get_current_user)):
    full_name = current_user.get('full_name', '')
    parts = full_name.split(maxsplit=2)
    
    surname = parts[0] if len(parts) > 0 else ''
    name = parts[1] if len(parts) > 1 else ''
    lastname = parts[2] if len(parts) > 2 else ''
    
    return {
        "success": True,
        "data": {
            "name": name,
            "surname": surname,
            "lastname": lastname
        }
    }

@app.get("/residents", response_model=dict)
async def get_residents(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.execute('SELECT * FROM residents')
    residents = cursor.fetchall()
    conn.close()

    formatted_residents = []
    for resident in residents:
        resident_dict = dict(resident)

        parents = []
        try:
            parents = json.loads(resident_dict['parents_json'])
        except (json.JSONDecodeError, TypeError):
            pass

        formatted_residents.append({
            "id": resident_dict['id'],
            "full_name": resident_dict['full_name'],
            "age": resident_dict['age'],
            "room": resident_dict['room'],
            "class": resident_dict['class_name'],
            "status": {
                "status": resident_dict['status_type'],
                "place": resident_dict['status_place'],
                "until": resident_dict['status_until']
            },
            "mobile": resident_dict['mobile'],
            "email": resident_dict['email'],
            "telegram": resident_dict['telegram'],
            "parents": parents,
            "profile_image": resident_dict['profile_image']
        })

    return {"success": True, "data": formatted_residents}

@app.get("/residents/{resident_id}", response_model=dict)
async def get_resident(
    resident_id: int,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    resident = conn.execute('''
        SELECT * FROM residents WHERE id = ?
    ''', (resident_id,)).fetchone()
    conn.close()

    if not resident:
        return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

    resident_dict = dict(resident)

    # Парсинг JSON полей
    parents = json.loads(resident_dict['parents_json']) if resident_dict['parents_json'] else []
    notes = json.loads(resident_dict['comments']) if resident_dict['comments'] else []
    warns = json.loads(resident_dict['warnings']) if resident_dict['warnings'] else []

    formatted_resident = {
        "id": resident_dict['id'],
        "profile_image": {
            "src": resident_dict['profile_image'] or "",
            "blur_hash": resident_dict['blur_hash'] or ""
        },
        "full_name": resident_dict['full_name'],
        "age": resident_dict['age'],
        "room": resident_dict['room'],
        "class": resident_dict['class_name'],
        "class_teacher": resident_dict['class_teacher'],
        "class_mentor": resident_dict['class_mentor'],
        "mobile": resident_dict['mobile'],
        "email": resident_dict.get('email'),
        "telegram": resident_dict.get('telegram'),
        "status": {
            "status": resident_dict['status_type'],
            "place": resident_dict.get('status_place'),
            "until": resident_dict.get('status_until')
        },
        "parents": parents,
        "notes": notes,
        "warns": warns
    }

    return {"success": True, "data": formatted_resident}

@app.post("/residents/{resident_id}/notes")
def create_note(
    resident_id: int,
    note_data: NotesCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        resident = conn.execute("SELECT comments FROM residents WHERE id = ?", (resident_id,)).fetchone()
        if not resident:
            return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

        comments = json.loads(resident['comments']) if resident['comments'] else []
        new_note = {
            "id": int(datetime.utcnow().timestamp() * 1000),
            "content": note_data.content,
            "author": current_user['full_name'],
            "created_at": datetime.utcnow().strftime("%d.%m.%Y")
        }
        comments.append(new_note)

        conn.execute("UPDATE residents SET comments = ? WHERE id = ?",
                    (json.dumps(comments), resident_id))
        conn.commit()

        return {"success": True, "data": {"id": new_note['id']}}
    finally:
        conn.close()

@app.delete("/residents/{resident_id}/notes")
def delete_note(
    resident_id: int,
    data: NotesDelete,  # Теперь принимаем JSON-тело
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        resident = conn.execute("SELECT comments FROM residents WHERE id = ?", (resident_id,)).fetchone()
        if not resident:
            return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

        comments = json.loads(resident['comments']) if resident['comments'] else []
        updated_comments = [note for note in comments if note.get('id') != data.id]  # Используем data.id

        conn.execute("UPDATE residents SET comments = ? WHERE id = ?",
                    (json.dumps(updated_comments), resident_id))
        conn.commit()

        return {"success": True, "data": {}}
    finally:
        conn.close()

@app.post("/residents/{resident_id}/warns")
def create_warn(
    resident_id: int,
    warn_data: NotesCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        resident = conn.execute("SELECT warnings FROM residents WHERE id = ?", (resident_id,)).fetchone()
        if not resident:
            return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

        warnings = json.loads(resident['warnings']) if resident['warnings'] else []
        new_warn = {
            "id": int(datetime.utcnow().timestamp() * 1000),
            "content": warn_data.content,
            "author": current_user['full_name'],
            "created_at": datetime.utcnow().strftime("%d.%m.%Y")
        }
        warnings.append(new_warn)

        conn.execute("UPDATE residents SET warnings = ? WHERE id = ?",
                    (json.dumps(warnings), resident_id))
        conn.commit()

        return {"success": True, "data": {"id": new_warn['id']}}
    finally:
        conn.close()

@app.delete("/residents/{resident_id}/warns")
def delete_warn(
    resident_id: int,
    data: WarnsDelete,  # Теперь принимаем JSON-тело
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        resident = conn.execute("SELECT warnings FROM residents WHERE id = ?", (resident_id,)).fetchone()
        if not resident:
            return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

        warnings = json.loads(resident['warnings']) if resident['warnings'] else []
        updated_warnings = [warn for warn in warnings if warn.get('id') != data.id]  # Используем data.id

        conn.execute("UPDATE residents SET warnings = ? WHERE id = ?",
                     (json.dumps(updated_warnings), resident_id))
        conn.commit()

        return {"success": True, "data": {}}
    finally:
        conn.close() 

@app.post("/residents", status_code=201)
async def create_resident(
    resident: ResidentCreate,
    current_user: dict = Depends(get_current_user)
):
    parents_json = json.dumps([p.dict() for p in resident.parents])

    conn = get_db()
    try:
        cursor = conn.execute('''
            INSERT INTO residents (
                full_name, age, room, class_name,
                class_teacher, class_mentor,
                mobile, email, telegram,
                status_type, status_place, status_until,
                parents_json, profile_image, blur_hash
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            resident.full_name,
            resident.age,
            resident.room,
            resident.class_name,
            resident.class_teacher,
            resident.class_mentor,
            resident.mobile,
            resident.email,
            resident.telegram,
            resident.status.status,
            resident.status.place,
            resident.status.until,
            parents_json,
            resident.profile_image,
            resident.blur_hash
        ))

        resident_id = cursor.lastrowid
        conn.commit()
        return {"success": True, "data": {"id": resident_id}}

    except sqlite3.Error:
        conn.rollback()
        return error_response("Ошибка сервера", "DB_ERROR", 400)
    finally:
        conn.close()

@app.put("/residents/{resident_id}")
async def update_resident(
    resident_id: int,
    resident: ResidentCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    try:
        db.execute('''UPDATE residents SET
            full_name = ?, age = ?, room = ?, class_name = ?,
            class_teacher = ?, class_mentor = ?,
            mobile = ?, email = ?, telegram = ?,
            status_type = ?, status_place = ?, status_until = ?
            WHERE id = ?''',
            (
                resident.full_name, resident.age, resident.room, resident.class_name,
                resident.class_teacher, resident.class_mentor,
                resident.mobile, resident.email, resident.telegram,
                resident.status.status, resident.status.place, resident.status.until,
                resident_id
            ))
        db.commit()

        # WebSocket broadcast for status update
        resident_status = {
            "id": resident_id,
            "status": {
                "status": resident.status.status,
                "place": resident.status.place,
                "until": resident.status.until
            }
        }
        message = {
            "op": "status:update",
            "path": "/residents",
            "data": resident_status
        }
        asyncio.create_task(broadcast_message(message))

        return {"success": True, "data": {}}

    except sqlite3.Error:
        return error_response("Ошибка сервера", "DB_ERROR", 500)
    finally:
        db.close()


@app.delete("/journals/cleaning/dates")
async def delete_cleaning_date(
    date_data: CleaningDateDelete,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        conn.execute("DELETE FROM cleaning_dates WHERE date = ?", (date_data.date,))
        conn.execute("DELETE FROM cleaning_marks WHERE date = ?", (date_data.date,))
        conn.commit()

        # WebSocket broadcast
        message = {
            "op": "date:delete",
            "path": "/journals/cleaning",
            "data": {"date": date_data.date}
        }
        asyncio.create_task(broadcast_message(message))

        return {"success": True, "data": {}}
    finally:
        conn.close()

@app.get("/journals/leave", response_model=BaseResponse)
async def get_leave_journal(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.execute('''
        SELECT lj.*, r.full_name, r.class_name, r.room 
        FROM leave_journal lj
        JOIN residents r ON lj.resident_id = r.id
    ''')
    data = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": data}

@app.get("/journals/leave/{leave_id}", response_model=BaseResponse)
async def get_leave_detail(leave_id: int, current_user: dict = Depends(get_current_user)):
    conn = get_db()
    leave = conn.execute('''
        SELECT lj.*, 
               r.full_name, r.class_name, r.age, r.room, r.class_teacher, r.class_mentor,
               r.mobile, r.status_type, r.status_place, r.status_until,
               r.parents_json, r.profile_image, r.blur_hash
        FROM leave_journal lj
        JOIN residents r ON lj.resident_id = r.id
        WHERE lj.id = ?
    ''', (leave_id,)).fetchone()
    
    if not leave:
        raise HTTPException(status_code=404, detail="Leave record not found")
    
    resident_data = {
        "id": leave['resident_id'],
        "profile_image": {
            "src": leave['profile_image'] or "",
            "blur_hash": leave['blur_hash'] or ""
        },
        "full_name": leave['full_name'],
        "age": leave['age'],
        "room": leave['room'],
        "class": leave['class_name'],
        "class_teacher": leave['class_teacher'],
        "class_mentor": leave['class_mentor'],
        "mobile": leave['mobile'],
        "status": {
            "status": leave['status_type'],
            "place": leave['status_place'],
            "until": leave['status_until']
        },
        "parents": json.loads(leave['parents_json'])
    }
    
    return {
        "success": True,
        "data": {
            **dict(leave),
            "resident": resident_data
        }
    }

@app.put("/journals/leave/{leave_id}/comment", response_model=BaseResponse)
async def update_leave_comment(
    leave_id: int,
    comment: CommentCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    conn.execute('''
        UPDATE leave_journal
        SET comment = ?
        WHERE id = ?
    ''', (comment.content, leave_id))
    conn.commit()
    conn.close()
    return {"success": True, "data": {}}

@app.put("/journals/leave/{leave_id}/status", response_model=BaseResponse)
async def update_leave_status(
    leave_id: int,
    status_data: LeaveStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    leave = conn.execute('SELECT address FROM leave_journal WHERE id = ?', (leave_id,)).fetchone()
    
    if not leave:
        raise HTTPException(status_code=404, detail="Leave record not found")
    
    # Логика изменения статуса
    new_status = status_data.status
    if new_status == 'outside' and leave['address'] == 'ФТЛ':
        new_status = 'school'
    
    update_params = {'status': new_status}
    if new_status != 'inside':
        update_params['leave_marked'] = str(int(datetime.utcnow().timestamp()))
    if new_status == 'returned':
        update_params['return_marked'] = str(int(datetime.utcnow().timestamp()))
    
    set_clause = ', '.join(f"{k} = ?" for k in update_params)
    conn.execute(f'''
        UPDATE leave_journal
        SET {set_clause}
        WHERE id = ?
    ''', (*update_params.values(), leave_id))
    conn.commit()
    conn.close()
    
    message = {
        "op": "leave:update",
        "path": "/journals/leave",
        "data": {"id": leave_id, "status": new_status}
    }
    asyncio.create_task(broadcast_message(message))
    
    return {"success": True, "data": {}}

@app.post("/journals/leave", response_model=BaseResponse)
async def create_leave_entry(
    entry: LeaveCreate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    
    # Проверка resident_id
    resident = conn.execute('SELECT 1 FROM residents WHERE id = ?', (entry.resident_id,)).fetchone()
    if not resident:
        raise HTTPException(status_code=404, detail="Resident not found")
    
    # Проверка application_id для типа application
    if entry.type == 'application':
        app_exists = conn.execute('SELECT 1 FROM applications WHERE id = ?', (entry.application_id,)).fetchone()
        if not app_exists:
            raise HTTPException(status_code=404, detail="Application not found")
    
    # Вставка записи
    cursor = conn.execute('''
        INSERT INTO leave_journal 
        (resident_id, application_id, leave_time, return_time, address, type)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (
        entry.resident_id,
        entry.application_id,
        entry.leave_time,
        entry.return_time,
        entry.address,
        entry.type
    ))
    
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()
    
    return {"success": True, "data": {"id": new_id}}

@app.get("/rooms", dependencies=[Depends(get_current_user)])
async def get_rooms():
    db = get_db()
    rooms = db.execute("SELECT DISTINCT room FROM residents").fetchall()
    result = []

    for room in rooms:
        residents = db.execute(
            "SELECT id, full_name, class_name as class FROM residents WHERE room = ?",
            (room['room'],)
        ).fetchall()

        result.append({
            "room_number": room['room'],
            "is_living": True,
            "residents": residents
        })

    db.close()
    return {"success": True, "data": result}

@app.get("/rooms/{room_number}", response_model=dict)
async def get_room(
    room_number: str,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    cursor = conn.execute('''
        SELECT
            id,
            full_name,
            age,
            room,
            class_name,
            class_mentor,
            status_type,
            status_place,
            status_until,
            profile_image,
            blur_hash
        FROM residents
        WHERE room = ?
    ''', (room_number,))

    residents = cursor.fetchall()
    conn.close()

    formatted_residents = []
    for resident in residents:
        resident_dict = dict(resident)
        formatted_residents.append({
            "id": resident_dict['id'],
            "profile_image": {
                "src": resident_dict['profile_image'] or "",
                "blur_hash": resident_dict['blur_hash'] or ""
            },
            "full_name": resident_dict['full_name'],
            "age": resident_dict['age'],
            "room": resident_dict['room'],
            "class": resident_dict['class_name'],
            "class_mentor": resident_dict['class_mentor'],
            "status": {
                "status": resident_dict['status_type'],
                "place": resident_dict.get('status_place'),
                "until": resident_dict.get('status_until')
            }
        })

    return {
        "success": True,
        "data": {
            "room_number": room_number,
            "residents": formatted_residents
        }
    }

@app.get("/rooms/{main_room}/{sub_room}", response_model=dict)
async def get_subroom(
    main_room: str,
    sub_room: str,
    current_user: dict = Depends(get_current_user)
):
    full_room = f"{main_room}/{sub_room}"
    return await get_room(full_room, current_user)

@app.get("/applications/leave", response_model=BaseResponse)
async def get_leave_applications(current_user: dict = Depends(get_current_user)):
    conn = get_db()
    cursor = conn.execute('''
        SELECT
            a.id,
            a.resident_id,
            r.full_name,
            r.class_name as class,
            r.room,
            a.leave_ts as leave,
            a.return_ts as return,
            a.address,
            a.accompany,
            a.status
        FROM applications a
        JOIN residents r ON a.resident_id = r.id
    ''')
    applications = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"success": True, "data": applications}

@app.get("/applications/leave/{application_id}", response_model=BaseResponse)
async def get_leave_application(
    application_id: int,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()

    app_data = conn.execute('''
        SELECT * FROM applications WHERE id = ?
    ''', (application_id,)).fetchone()

    if not app_data:
        conn.close()
        return error_response("Заявление не найдено", "APPLICATION_NOT_FOUND", 404)

    resident = conn.execute('''
        SELECT * FROM residents WHERE id = ?
    ''', (app_data['resident_id'],)).fetchone()

    files = conn.execute('''
        SELECT filename, filepath as src, blur_hash
        FROM application_files
        WHERE application_id = ?
    ''', (application_id,)).fetchall()

    conn.close()

    resident_dict = dict(resident)
    formatted_resident = {
        "id": resident_dict['id'],
        "profile_image": {
            "src": resident_dict['profile_image'] or "",
            "blur_hash": resident_dict['blur_hash'] or ""
        },
        "full_name": resident_dict['full_name'],
        "age": resident_dict['age'],
        "room": resident_dict['room'],
        "class": resident_dict['class_name'],
        "class_teacher": resident_dict['class_teacher'],
        "class_mentor": resident_dict['class_mentor'],
        "mobile": resident_dict['mobile'],
        "status": {
            "status": resident_dict['status_type'],
            "place": resident_dict.get('status_place'),
            "until": resident_dict.get('status_until')
        },
        "parents": json.loads(resident_dict['parents_json']) if resident_dict['parents_json'] else []
    }

    formatted_response = {
        "id": app_data['id'],
        "resident": formatted_resident,
        "leave": app_data['leave_ts'],
        "return": app_data['return_ts'],
        "address": app_data['address'],
        "accompany": app_data['accompany'],
        "status": app_data['status'],
        "comment": app_data['comment'],
        "created_at": app_data['created_at'],
        "files": [dict(file) for file in files]
    }

    return {"success": True, "data": formatted_response}

@app.post("/applications/leave", response_model=BaseResponse, status_code=201)
async def create_leave_application_json(
    application: ApplicationCreate,
    current_user: dict = Depends(get_current_user)
):
    db = get_db()
    resident = db.execute("SELECT 1 FROM residents WHERE id = ?", (application.resident_id,)).fetchone()
    if not resident:
        return error_response("Интернатовец не найден", "RESIDENT_NOT_FOUND", 404)

    try:
        with db:
            cursor = db.execute('''
                INSERT INTO applications (
                    resident_id,
                    leave_ts,
                    return_ts,
                    address,
                    accompany,
                    status
                ) VALUES (?, ?, ?, ?, ?, 'review')
            ''', (
                application.resident_id,
                application.leave_ts,
                application.return_ts,
                application.address,
                application.accompany
            ))

            return {
                "success": True,
                "data": {
                    "id": cursor.lastrowid,
                    "status": "review",
                    "created_at": datetime.now().isoformat()
                }
            }

    except sqlite3.Error:
        return error_response("Ошибка сервера", "DB_ERROR", 500)
    finally:
        db.close()

@app.post("/applications/leave/{application_id}/file", response_model=BaseResponse)
async def upload_application_file(
    application_id: int,
    file: UploadFile = File(..., alias="main"),
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    app_exists = conn.execute('''
        SELECT 1 FROM applications WHERE id = ?
    ''', (application_id,)).fetchone()

    if not app_exists:
        conn.close()
        return error_response("Заявление не найдено", "APPLICATION_NOT_FOUND", 404)

    file_uuid = str(uuid.uuid4())
    filename = f"{file_uuid}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())
    except Exception:
        return error_response("Ошибка сервера", "FILE_SAVE_ERROR", 500)

    try:
        conn.execute('''
            INSERT INTO application_files
            (application_id, filename, filepath)
            VALUES (?, ?, ?)
        ''', (application_id, file.filename, file_path))
        conn.commit()
        return {"success": True, "data": {}}
    except sqlite3.Error:
        return error_response("Ошибка сервера", "DB_ERROR", 500)
    finally:
        conn.close()

@app.delete("/applications/leave/{application_id}/file", response_model=BaseResponse)
async def delete_application_file(
    application_id: int,
    path: str,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        file_info = conn.execute('''
            SELECT filepath FROM application_files
            WHERE application_id = ? AND filename = ?
        ''', (application_id, path)).fetchone()

        if not file_info:
            return error_response("Файл не найден", "FILE_NOT_FOUND", 404)

        try:
            os.remove(file_info['filepath'])
        except FileNotFoundError:
            pass

        conn.execute('''
            DELETE FROM application_files
            WHERE application_id = ? AND filename = ?
        ''', (application_id, path))
        conn.commit()

        return {"success": True, "data": {}}
    except Exception:
        return error_response("Ошибка сервера", "SERVER_ERROR", 500)
    finally:
        conn.close()

@app.put("/applications/leave/{application_id}/comment", response_model=BaseResponse)
async def update_application_comment(
    application_id: int,
    comment: ApplicationComment,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        result = conn.execute('''
            UPDATE applications
            SET comment = ?
            WHERE id = ?
        ''', (comment.content, application_id))

        if result.rowcount == 0:
            return error_response("Заявление не найдено", "APPLICATION_NOT_FOUND", 404)

        conn.commit()
        return {"success": True, "data": {}}
    except sqlite3.Error:
        return error_response("Ошибка сервера", "DB_ERROR", 500)
    finally:
        conn.close()

@app.put("/applications/leave/{application_id}/status", response_model=BaseResponse)
async def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    current_user: dict = Depends(get_current_user)
):
    valid_statuses = {'review', 'denied', 'cancelled', 'accepted'}
    if status_data.status not in valid_statuses:
        return error_response("Неправильный статус рассмотрения заявления", "INVALID_REVIEW_STATUS", 400)

    conn = get_db()
    try:
        result = conn.execute('''
            UPDATE applications
            SET status = ?
            WHERE id = ?
        ''', (status_data.status, application_id))

        if result.rowcount == 0:
            return error_response("Заявление не найдено", "APPLICATION_NOT_FOUND", 404)

        conn.commit()

        # WebSocket broadcast
        message = {
            "op": "status:update",
            "path": "/applications/leave",
            "data": {
                "id": application_id,
                "status": {"status": status_data.status}
            }
        }
        asyncio.create_task(broadcast_message(message))

        return {"success": True, "data": {}}
    except sqlite3.Error:
        return error_response("Ошибка сервера", "DB_ERROR", 500)
    finally:
        conn.close()

@app.get("/journals/cleaning", response_model=dict)
async def get_cleaning_journal(current_user: dict = Depends(get_current_user)):
    conn = get_db()

    dates = conn.execute("SELECT date FROM cleaning_dates ORDER BY date").fetchall()

    rooms = conn.execute("SELECT DISTINCT room FROM cleaning_marks").fetchall()

    result = {
        "dates": [format_date(d['date']) for d in dates],
        "rooms": []
    }

    for room in rooms:
        marks = conn.execute('''
            SELECT date, mark FROM cleaning_marks
            WHERE room = ? ORDER BY date
        ''', (room['room'],)).fetchall()

        result["rooms"].append({
            "room_number": room['room'],
            "marks": [{
                "date": format_date(m['date']),
                "mark": m['mark']
            } for m in marks]
        })

    conn.close()
    return {"success": True, "data": result}

@app.post("/journals/cleaning/dates")
async def add_cleaning_date(
    date_req: CleaningDateRequest,
    current_user: dict = Depends(get_current_user)
):
    month_names = [
        "января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"
    ]

    try:
        date_str = f"{date_req.day} {month_names[date_req.month - 1][:3].upper()}"
    except IndexError:
        return error_response("Неправильный месяц", "INVALID_MONTH", 400)

    conn = get_db()
    try:
        conn.execute("INSERT INTO cleaning_dates (date) VALUES (?)", (date_str,))
        conn.commit()

        # WebSocket broadcast
        message = {
            "op": "date:add",
            "path": "/journals/cleaning",
            "data": {"date": date_str}
        }
        asyncio.create_task(broadcast_message(message))

        return {"success": True, "data": {}}
    except sqlite3.IntegrityError:
        return error_response("Дата уже существует", "DATE_ALREADY_EXIST", 400)
    finally:
        conn.close()


@app.put("/journals/cleaning/marks")
async def update_cleaning_mark(
    mark_data: CleaningMarkUpdate,
    current_user: dict = Depends(get_current_user)
):
    conn = get_db()
    try:
        if mark_data.mark == 0:
            conn.execute('''
                DELETE FROM cleaning_marks
                WHERE date = ? AND room = ?
            ''', (mark_data.date, mark_data.room))
        else:
            conn.execute('''
                INSERT OR REPLACE INTO cleaning_marks
                (date, room, mark) VALUES (?, ?, ?)
            ''', (mark_data.date, mark_data.room, mark_data.mark))

        conn.commit()

        # WebSocket broadcast
        message = {
            "op": "mark:update",
            "path": "/journals/cleaning",
            "data": {
                "room": mark_data.room,
                "date": mark_data.date,
                "mark": mark_data.mark
            }
        }
        asyncio.create_task(broadcast_message(message))

        return {"success": True, "data": {}}
    finally:
        conn.close()

@app.get("/no_img.png")
async def get_no_image():
    # Путь к файлу изображения
    file_path = os.path.join(os.getcwd(), "uploads", "no_img.png")
    
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Image not found")
    
    return FileResponse(
        path=file_path,
        media_type="image/png",
        filename="no_img.png",
        headers={
            "Cache-Control": "public, max-age=86400",
            "Content-Disposition": "inline"
        }
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3001)
