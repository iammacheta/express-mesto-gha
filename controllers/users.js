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
        return res.status(errorCodes.NotFound).send({ message: 'Некорректный id пользователя' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректные данные пользователя' });
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.NotFound).send({ message: 'Пользователь не найден' });
      }
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
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.NotFound).send({ message: 'Пользователь не найден' });
      }
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректная ссылка для аватара' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};
