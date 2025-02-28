1. Общая архитектура 
·	Технологии : FastAPI, SQLite, WebSocket, JWT-аутентификация.
·	Основные компоненты :
·	REST API для управления резидентами, заявлениями и журналом уборки.
·	WebSocket для обновлений данных.
·	База данных SQLite с таблицами: users, residents, applications, cleaning_dates, cleaning_marks, application_files.
2. Структура базы данных 
Таблицы и связи 
1.	users 
·	Поля: id, username, hashed_password, salt, disabled. 
·	Назначение: Хранение учетных записей пользователей с хэшированными паролями.
1.	residents 
·	Поля: id, full_name, age, room, class_name, mobile, status_type, parents_json (JSON-массив родителей), profile_image и др. 
·	Связи: Связана с applications (1:N) и cleaning_marks (1:N).
1.	applications 
·	Поля: id, resident_id (внешний ключ), leave_ts, return_ts, status (статус заявления: review/denied/accepted). 
·	Связи: Связана с application_files (1:N).
1.	cleaning_dates 
·	Поля: date (первичный ключ). 
·	Назначение: Хранение дат уборки.
1.	cleaning_marks 
·	Поля: date (внешний ключ), room, mark (оценка уборки). 
·	Уникальность: Комбинация date и room.
1.	application_files 
·	Поля: id, application_id (внешний ключ), filename, filepath. 
·	Назначение: Хранение файлов, прикрепленных к заявлениям.
3. Основные endpoints 
Аутентификация 
1.	POST /register Регистрация нового пользователя. 
2.	POST /token Получение JWT-токена. 
Управление резидентами 
1.	GET /residents Получение списка всех резидентов. 
2.	GET /residents/{resident_id} Получение данных конкретного резидента. 
3.	POST /residents Создание нового резидента. 
4.	PUT /residents/{resident_id} Обновление данных резидента (включая WebSocket-уведомление при изменении статуса). 
Заявления на отпуск 
1.	GET /applications/leave Получение всех заявлений. 
2.	GET /applications/leave/{application_id} Получение данных конкретного заявления с файлами. 
3.	POST /applications/leave Создание нового заявления. 
4.	POST /applications/leave/{application_id}/file Загрузка файла к заявлению. 
5.	DELETE /applications/leave/{application_id}/file Удаление файла из заявления. 
6.	PUT /applications/leave/{application_id}/comment Обновление комментария к заявлению. 
7.	PUT /applications/leave/{application_id}/status Изменение статуса заявления (с WebSocket-уведомлением). 
Журнал уборки 
1.	GET /journals/cleaning Получение данных журнала уборки. 
2.	POST /journals/cleaning/dates Добавление новой даты уборки (с WebSocket-уведомлением). 
3.	DELETE /journals/cleaning/dates Удаление даты уборки (с WebSocket-уведомлением). 
4.	PUT /journals/cleaning/marks Обновление оценки уборки для комнаты (с WebSocket-уведомлением). 
Управление комнатами 
1.	GET /rooms Получение списка комнат с проживающими. 
2.	GET /rooms/{room_number} Получение данных конкретной комнаты. 
3.	GET /rooms/{main_room}/{sub_room} Получение данных подкомнаты (например, "3/4"). 
WebSocket 
1.	/ws Подключение для получения уведомлений в реальном времени.
Дополнительные операции 
1.	DELETE /applications/leave/{application_id}/file Удаление файла из заявления. 
2.	PUT /applications/leave/{application_id}/comment Обновление комментария к заявлению. 
Примечание : Все endpoints требуют аутентификации через JWT-токен (кроме /register и /token). WebSocket-уведомления отправляются при изменении статусов, добавлении/удалении дат уборки и обновлении оценок. 
4. Вспомогательные функции 
·	Форматирование дат Функция format_date преобразует дату в формат "15 января". 
·	Хэширование паролей Используется bcrypt с добавлением "соли" и "перца" (параметр окружения PEPPER). 
·	Работа с файлами Загруженные файлы сохраняются в папку uploads с уникальными именами (UUID). 
5. Безопасность 
·	JWT-токены Срок действия: 30 минут.Алгоритм: HS256, секретный ключ генерируется при старте. 
·	CORS Разрешены запросы с http://localhost:3000. 
6. Зависимости 
·	Основные библиотеки : 
·	FastAPI: Документация 
·	SQLite3: Документация 
·	Дополнительно : 
·	Pydantic для валидации данных. 
·	JWT для токенов. 
·	WebSocket для взаимодействия.
7. Диаграммы 
·	Диаграмма классов :Основные Pydantic-модели: UserCreate, ResidentCreate, ApplicationCreate и др.Связи: Например, ResidentCreate содержит вложенные объекты ResidentStatus и список Parent. 
·	Схема БД :Основные связи:residents ↔ applications ↔ application_filescleaning_dates ↔ cleaning_marks 

