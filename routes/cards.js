const cards = require('express').Router();

const { getAllCards, createCard } = require('../controllers/cards')

cards.get('/', getAllCards);
cards.post('/', createCard);

module.exports = cards;
