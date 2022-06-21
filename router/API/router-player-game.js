const express = require('express');
const routerPlayerGame = express.Router();
const { body } = require('express-validator');

const { authenticationGame, createRoom } = require('../../controllers/play-game-controller');
const restrict = require('../../middleware/restrict-jwt');

routerPlayerGame.post('/api/player/game/create-room', [
    body('name').notEmpty()
    ],
    restrict,
    authenticationGame,
    createRoom)

module.exports = { routerPlayerGame }