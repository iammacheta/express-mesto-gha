// мидлвэр для авторизации
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

module.exports = (req, res, next) => {
  // достаём авторизационный заголовок
  const { authorization = '' } = req.headers;

  // убеждаемся, что заголовок есть
  if (!authorization) {
    next(new UnauthorizedError('Необходима авторизация'));
  }

  // извлечём токен
  const token = authorization.replace(/^(Bearer)*\s*(token )?\s*/i, '');
  let payload;

  try {
    // попытаемся верифицировать токен
    payload = jwt.verify(token, '3c574a35e06371bba21dd76a7b43b6e5ed8af68f6db0c6e8dd829c711af29e85');
  } catch (err) {
    // отправим ошибку, если не получилось
    next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса
  next(); // пропускаем запрос дальше
};
