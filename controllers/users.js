const bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const { errorCodes } = require('../utils/constants');
const User = require('../models/user');

module.exports.getAllusers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(errorCodes.NotFound).send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Некорректный id пользователя' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

// контроллер для получения информации о текущем пользователе
module.exports.aboutMe = (req, res) => {
  User.findById(req.user._id) // user._id добавляем в пейлоад в миддлваре auth
    .then((user) => {
      if (!user) {
        return res.status(errorCodes.NotFound).send({ message: 'Такого пользователя не существует' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Некорректный id пользователя' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!email || !validator.isEmail(email)) {
    return res.status(errorCodes.IncorrectData)
      .send({ message: 'Передан некорректный email пользователя' });
  }
  return bcrypt.hash(password, 12)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректные данные пользователя' });
      } if (err.code === 11000) {
        return res.status(errorCodes.DuplicateForUniqueValue).send({
          message: 'Указанный email уже существует',
        });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(errorCodes.NotFound).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректные данные профиля' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.updateAvatar = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (!user) {
        return res.status(errorCodes.NotFound).send({ message: 'Пользователь не найден' });
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректные данные для аватара' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        '3c574a35e06371bba21dd76a7b43b6e5ed8af68f6db0c6e8dd829c711af29e85', // секретный ключ
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7, // кука будет просрочена через 7 дней после создания
          httpOnly: true,
        }).send({ _id: user._id });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
