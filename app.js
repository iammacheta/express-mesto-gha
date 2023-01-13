require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const {
  celebrate,
  Joi,
  errors,
  Segments,
} = require('celebrate');
const cors = require('cors');
const { limiter } = require('./utils/rateLimit');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/NotFoundError');
const { URL_REG_EXP } = require('./utils/constants');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const otherErrors = require('./middlewares/otherErrors');

const { PORT = 3000, DB_ADDRESS } = process.env;

const app = express();

mongoose.connect(DB_ADDRESS, {
  useNewUrlParser: true,
});

app.use(helmet()); // Применяем мидлвару Helmet для настройки заголовков HTTP
app.use(requestLogger); // подключаем логгер запросов
app.use(limiter); // Применяем ограничение по количеству запросов ко всем путям
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

// TBD Удалить после прохождения ревью
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post('/signin', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REG_EXP),
  }),
}), createUser);

app.use(auth); // применяем middleware авторизации для всех остальных роутов

app.use('/users', users);
app.use('/cards', cards);

// Обработка неправильного пути
app.use('/', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // обработчик ошибок celebrate

app.use(otherErrors);// здесь обрабатываем все остальные ошибки
app.listen(PORT);
