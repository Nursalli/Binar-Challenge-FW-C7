//Connect Models
const { User_games, User_game_biodata, User_game_histories } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

//API
const authenticationGame = (req, res, next) => {

    const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({
                errors: errors.array()
            })
        }

    next()
}

const createRoom = (req, res) => {
    const name = req.body.name 
    res.status(200).json({
        status: 'Created Room',
        name,
        roomId: bcrypt.hashSync(name, 10)
    })
}

module.exports = { authenticationGame, createRoom }