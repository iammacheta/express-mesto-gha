const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  celebrate,
  Joi,
  errors,
  Segments,
} = require('celebrate');
const { limiter } = require('./utils/rateLimit');
const { errorCodes } = require('./utils/errorCodes');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(helmet()); // Применяем мидлвару Helmet для настройки заголовков HTTP
app.use(limiter); // Применяем ограничение по количеству запросов ко всем путям
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{5,}$/).required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().pattern(/^[a-zA-Z0-9]{5,}$/).required(),
  }).unknown(true),
}), createUser);

app.use(auth); // применяем middleware авторизации для всех остальных роутов

app.use('/users', users);
app.use('/cards', cards);

// Обработка неправильного пути
app.use('/', (req, res) => {
  res.status(errorCodes.NotFound).send({ message: 'Страница не найдена' });
});

app.use(errors()); // обработчик ошибок celebrate

// здесь обрабатываем все остальные ошибки
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
  next();
});
app.listen(PORT);
