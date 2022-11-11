const cards = require('express').Router();

const { getAllCards, createCard, deleteCard, likeCard } = require('../controllers/cards')

cards.get('/', getAllCards);
cards.post('/', createCard);
cards.delete('/:cardId', deleteCard);
cards.put('/:cardId/likes', likeCard);

module.exports = cards;
