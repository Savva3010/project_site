Документация разработчика

1. Общая информация
Приложение использует FastAPI для создания веб-сервера с поддержкой CORS и JWT-авторизации. База данных SQLite содержит несколько таблиц для управления информацией об интернате.
Если не указан метод запроса, значит метод - GET
Перед запуском необходимо установить зависимости:
pip install -r requirements.txt
Для запуска необходимо выполнить данную команду:
uvicorn main:app --host 0.0.0.0 --port 3001
Приложение будет доступно на порту 3001

2. Таблицы базы данных

Таблица users:
- id (PRIMARY KEY)
- username (UNIQUE)
- hashed_password
- salt
- disabled (BOOLEAN)

Таблица residents:
- id (PRIMARY KEY AUTOINCREMENT)
- full_name
- age
- room
- class_name
- class_teacher
- class_mentor
- mobile
- email
- telegram
- status_type
- status_place
- status_until
- parents_json
- profile_image
- blur_hash

Таблица applications:
- id (PRIMARY KEY AUTOINCREMENT)
- resident_id
- leave_ts
- return_ts
- address
- accompany
- status ('review', 'denied', 'cancelled', 'accepted')
- comment
- created_at

Таблица application_files:
- id (PRIMARY KEY AUTOINCREMENT)
- application_id
- filename
- filepath
- blur_hash

Таблица cleaning_dates:
- date (PRIMARY KEY)

Таблица cleaning_marks:
- id (PRIMARY KEY AUTOINCREMENT)
- date
- room
- mark

3. Endpoints авторизации

/register - регистрация нового пользователя
/token - получение токена авторизации

4. Endpoints жильцов

/residents - получение списка всех жильцов
/residents/{resident_id} - получение информации о конкретном жильце
/residents - создание нового жильца (POST)
/residents/{resident_id} - обновление информации о жильце (PUT)

5. Endpoints комнат

/rooms - получение списка всех комнат
/rooms/{room_number} - информация о конкретной комнате
/rooms/{main_room}/{sub_room} - информация о подкомнате

6. Endpoints заявок на выход

/applications/leave - список всех заявок
/applications/leave/{application_id} - информация о конкретной заявке
/applications/leave - создание новой заявки (POST)
/applications/leave/{application_id}/file - загрузка файла к заявке (POST)
/applications/leave/{application_id}/file - удаление файла из заявки (DELETE)
/applications/leave/{application_id}/comment - обновление комментария к заявке (PUT)
/applications/leave/{application_id}/status - обновление статуса заявки (PUT)

7. Endpoints журнала уборки

/journals/cleaning - получение журнала уборки
/journals/cleaning/dates - добавление даты уборки (POST)
/journals/cleaning/dates - удаление даты уборки (DELETE)
/journals/cleaning/marks - обновление оценок уборки (PUT)

8. WebSocket

/ws - WebSocket соединение для пинг-понг проверок

9. Дополнительная информация

- Приложение использует JWT для авторизации
- Все endpoints требуют авторизации, кроме /register и /token
- Файлы загружаются в директорию uploads
- Для хэширования паролей используется bcrypt
- Время жизни токена доступа - 30 минут