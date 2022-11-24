const { errorCodes } = require('../utils/errorCodes');
const Card = require('../models/card');

module.exports.getAllCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((cardWasCreated) => res.send({ data: cardWasCreated }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Переданы некорректные данные карточки' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        return res.status(errorCodes.NotFound).send({ message: 'Карточка не найдена' });
      }
      if (card.owner.toString() !== req.user._id) {
        return res.status(errorCodes.NotFound).send({ message: 'Ошибка авторизации. Можно удалять только свои карточки' });
      }
      return card.remove().then(() => {
        res.send({ data: card });
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Некорректный id карточки' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(errorCodes.NotFound).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Некорректный id карточки' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return res.status(errorCodes.NotFound).send({ message: 'Карточка не найдена' });
      }
      return res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(errorCodes.IncorrectData).send({ message: 'Некорректный id карточки' });
      }
      return res.status(errorCodes.OtherError).send({ message: 'На сервере произошла ошибка' });
    });
};
