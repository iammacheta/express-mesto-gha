const cards = require('express').Router();

const { getAllCards, createCard, deleteCard } = require('../controllers/cards')

cards.get('/', getAllCards);
cards.post('/', createCard);
cards.delete('/:cardId', deleteCard);

module.exports = cards;
