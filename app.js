const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { limiter } = require('./utils/rateLimit');
const { errorCodes } = require('./utils/constants');
const users = require('./routes/users');
const cards = require('./routes/cards');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
});

// временное решение авторизации
app.use((req, res, next) => {
  req.user = {
    _id: '636a673821bc90c77bdf279e',
  };
  next();
});

app.use(limiter); // Применяем ограничение по количеству запросов ко всем путям
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/users', users);
app.use('/cards', cards);

// Обработка неправильного пути
app.use('/', (req, res) => {
  res.status(errorCodes.NotFound).send({ message: 'Страница не найдена' });
});

app.listen(PORT);
