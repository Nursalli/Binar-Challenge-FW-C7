const express = require('express');
const routerPlayerGame = express.Router();
const { body } = require('express-validator');

//Contoller
const playGame = require('../../controllers/play-game-controller');

//Restrict
const restrict = require('../../middleware/restrict-jwt');

//Options
const option = ['R', 'S', 'P'];

//Endpoint Router
routerPlayerGame.post('/create-room', [
    body('name').notEmpty()
    ],
    restrict,
    playGame.authenticationGame,
    playGame.createRoom)

routerPlayerGame.post('/join', [
    body('roomId').notEmpty()
    ],
    restrict,
    playGame.authenticationGame,
    playGame.joinRoom)

routerPlayerGame.post('/play/:roomId', [
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
    playGame.authenticationGame,
    playGame.playGame)

routerPlayerGame.get('/play/:roomId/result', 
    restrict,
    playGame.gameResult)

module.exports = routerPlayerGame