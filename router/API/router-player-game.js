const express = require('express');
const routerPlayerGame = express.Router();
const { body } = require('express-validator');

const { authenticationGame, createRoom, joinRoom, playGame, gameResult } = require('../../controllers/play-game-controller');
const restrict = require('../../middleware/restrict-jwt');
const option = ['R', 'S', 'P'];

routerPlayerGame.post('/api/player/game/create-room', [
    body('name').notEmpty()
],
    restrict,
    authenticationGame,
    createRoom)

routerPlayerGame.post('/api/player/game/join', [
    body('roomId').notEmpty()
],
    restrict,
    authenticationGame,
    joinRoom)

routerPlayerGame.post('/api/player/game/play/:roomId', [
    body('opt_1').custom((data) => {
        const checkData = option.includes(data);
        if(!checkData){
            throw new Error('Option 1 Invalid');
        } else {
            return true;
        }
    }),
    body('opt_2').custom((data) => {
        const checkData = option.includes(data);
        if(!checkData){
            throw new Error('Option 2 Invalid');
        } else {
            return true;
        }
    }),
    body('opt_3').custom((data) => {
        const checkData = option.includes(data);
        if(!checkData){
            throw new Error('Option 3 Invalid');
        } else {
            return true;
        }
    }),
],
    restrict,
    authenticationGame,
    playGame)

routerPlayerGame.get('/api/player/game/play/:roomId/result', 
    restrict,
    gameResult)

module.exports = { routerPlayerGame }