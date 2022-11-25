const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { errorCodes } = require('../utils/errorCodes');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const ForbiddenError = require('../errors/ForbiddenError');

const errorNotFound = new NotFoundError('Нет пользователя с таким id');
const errorBadRequest = new BadRequestError('Переданы некорректные данные');
const errorForbidden = new ForbiddenError('Ошибка авторизации. Нельзя редактировать чужой профиль');

module.exports.getAllusers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw errorNotFound;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(errorBadRequest);
      } else {
        next(err);
      }
    });
};

// контроллер для получения информации о текущем пользователе
module.exports.aboutMe = (req, res, next) => {
  User.findById(req.user._id) // user._id добавляем в пейлоад в миддлваре auth
    .then((user) => {
      if (!user) {
        throw errorNotFound;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(errorBadRequest);
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  bcrypt.hash(password, 12)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const { password: removed, ...rest } = user.toObject();
      return res.send({ data: rest });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(errorBadRequest);
      } else if (err.code === errorCodes.UniqueErrorCode) {
        next(new ConflictError('При регистрации указан email, который уже существует на сервере'));
      } else {
        next(err);
      }
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw errorNotFound;
      }
      const { password: removed, ...rest } = user.toObject();
      return res.send({ data: rest });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(errorBadRequest);
      } else {
        next(err);
      }
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw errorNotFound;
      }
      const { password: removed, ...rest } = user.toObject();
      return res.send({ data: rest });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(errorBadRequest);
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw errorNotFound;
      }
      // создадим токен
      const token = jwt.sign(
        { _id: user._id },
        '3c574a35e06371bba21dd76a7b43b6e5ed8af68f6db0c6e8dd829c711af29e85',
        { expiresIn: '7d' }, // токен будет просрочен через 7 дней после создания
      );

      // вернём токен
      res
        .cookie('jwt', token, {
          // token - наш JWT токен, который мы отправляем
          maxAge: 3600000 * 24 * 7, // кука будет просрочена через 7 дней после создания
          httpOnly: true,
        }).send({ token });
    })
    .catch(next);
};
