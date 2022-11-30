// мидлвэр для авторизации
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization } = req.headers;

  // убеждаемся, что заголовок есть
  if (!authorization) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  // извлечём токен
  const token = authorization.replace(/^Bearer*\s*/i, ''); // это обязательно
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, process.env.SECRET_KEY);
  } catch (err) {
    // отправим ошибку, если не получилось
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
