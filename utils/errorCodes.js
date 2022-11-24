module.exports.errorCodes = {
  BadRequest: 400, // переданы некорректные данные
  Unauthorized: 401, // передан неверный логин или пароль или jwt
  Forbidden: 403, // попытка удалить чужую карточку или отредактировать профиль
  NotFound: 404,
  Conflict: 409, // при регистрации указан email, который уже существует на сервере.
  InternalServerError: 500, // остальные ошибки
  UniqueErrorCode: 11000, // указанный email уже есть в базе
};
