# Бэкенд для проекта "Личная фотогалерея"

## Описание проекта

Этот проект представляет собой бэкенд-часть веб-приложения, позволяющего регистрировать новых пользователей, авторизовывать существующих, а также предоставлять доступ к информации профиля и карточкам. Проект разработан с целью изучения и применения практик разработки серверной части приложений, в том числе работы с базами данных, аутентификации и авторизации пользователей, а также обработки ошибок.

Адрес проекта:
https://mesto.ichetovkin.nomoredomains.club/

## Функциональность

- Регистрация и авторизация пользователей;
- Возможность получения информации о профиле авторизованного пользователя;
- Работа с карточками (создание, удаление, получение списка карточек, лайк и дизлайк).

## Технологии

- `Node.js` и `Express` для создания сервера;
- `MongoDB` в качестве базы данных для хранения информации о пользователях и карточках;
- `Mongoose` для работы с MongoDB;
- `bcryptjs` для хеширования паролей пользователей;
- `JWT` (JSON Web Token) для реализации механизма аутентификации и авторизации;
- `Валидаторы` для проверки корректности входящих данных.

## Результаты и выводы

В результате реализации проекта удалось практически применить знания по созданию серверной части веб-приложений, научиться работать с базами данных, а также освоить механизмы аутентификации и авторизации.

## Установка и запуск
### Системные требования
- **Node.js**: не ниже 14.0.
- **MongoDB**: Для хранения данных проект использует MongoDB. Убедитесь, что у вас установлена и запущена MongoDB. Инструкции по установке можно найти на официальном сайте [MongoDB](https://www.mongodb.com/).

### Запуск

1. Клонируйте репозиторий:
```bash
git clone https://github.com/iammacheta/express-mesto-gha.git
```
2. Установите зависимости:
```bash
npm i
```
3. Запустите сервер:
```bash
4. npm run start
```
Для запуска сервера с хот релоудом используйте:
```bash
npm run dev
```

## Структура проекта

Проект организован следующим образом:

`app.js` — точка входа в приложение, настройка сервера и подключение к базе данных;

`/models` — содержит описания схем пользователя и карточки для MongoDB;

`/controllers` — содержит логику обработки запросов к API;

`/routes` — содержит описание маршрутов API;

## Список доступных эндпоинтов

| Роут| Запрос | Действие| Ошибки|
|----|----|----|----|
| `/users`| GET    | GET-запрос возвращает всех пользователей из базы данных.|400 — Переданы некорректные данные при создании пользователя. 500 — Ошибка по умолчанию.|
| `/users`| POST   | POST-запрос создаёт пользователя с переданными в теле запроса `name`, `about`, `avatar`.| 400 — Переданы некорректные данные при создании пользователя. 500 — Ошибка по умолчанию.                        |
| `/users/:userId`   | GET    | GET-запрос возвращает пользователя по переданному `_id`.| 404 — Пользователь по указанному `_id` не найден. 500 — Ошибка по умолчанию.                                    |
| `/users/me`| PATCH  | PATCH-запрос обновляет информацию о пользователе.| 400 — Переданы некорректные данные при обновлении профиля. 404 — Пользователь с указанным `_id` не найден. 500 — Ошибка по умолчанию. |
| `/users/me/avatar` | PATCH  | PATCH-запрос обновляет аватар пользователя.| 400 — Переданы некорректные данные при обновлении аватара. 404 — Пользователь с указанным `_id` не найден. 500 — Ошибка по умолчанию. |
| `/cards`| GET    | GET-запрос возвращает все карточки из базы данных.|400 — Переданы некорректные данные при создании карточки. 500 — Ошибка по умолчанию.|
| `/cards`| POST   | POST-запрос создает новую карточку по переданным параметрам.| 400 — Переданы некорректные данные при создании карточки. 500 — Ошибка по умолчанию.|
| `/cards/:cardId`| DELETE | DELETE-запрос удаляет карточку по `_id`.| 404 — Карточка с указанным `_id` не найдена.|
| `/cards/:cardId/likes` | PUT| PUT-запрос добавляет лайк карточке.| 400 — Переданы некорректные данные для постановки лайка. 404 — Передан несуществующий `_id` карточки. 500 — Ошибка по умолчанию. |
| `/cards/:cardId/likes` | DELETE | DELETE-запрос удаляет лайк с карточки.| 400 — Переданы некорректные данные для снятии лайка. 404 — Передан несуществующий `_id` карточки. 500 — Ошибка по умолчанию. |
