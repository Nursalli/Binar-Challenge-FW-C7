//Connect Models
const { User_game_histories } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const randomstring = require('randomstring');
const jwt_decode = require('jwt-decode');

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

const createRoom = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);
    
    const data = {
        id_user: decoded.id,
        time: 0,
        room_id: req.body.name + randomstring.generate(5),
        score: 0
    }

    await User_game_histories.create(data);

    res.status(200).json({
        status: 'Created Room',
        roomId: data.room_id
    })
}

const joinRoom = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);

    const dataUser = await User_game_histories.findOne({
        where: {
            [Op.and] : {
                id_user: decoded.id,
                room_id: req.body.roomId
            }
        }
    })

    if(dataUser){
        res.status(400).json({
            status: 'You Are Already in roomId'
         })
    } else {
        const data = await User_game_histories.findAll({
            where: {
                room_id: req.body.roomId 
            }
        });
    
        const availableRoom = data.map(i => i);
    
        if(availableRoom.length > 0){
            if(availableRoom.length === 1){
                const data = {
                    id_user: decoded.id,
                    time: 0,
                    room_id: req.body.roomId,
                    score: 0
                }

                await User_game_histories.create(data);

                res.status(200).json({
                    status: "Success Join roomId, Let's Play"
                })
            } else {
                res.status(400).json({
                    status: 'roomId Already Use to 2 Player'
                })
            }
        } else {
            res.status(400).json({
                status: 'roomId Not Found!'
            })
        }
    }
}

const playGame = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);

    const dataUser = await User_game_histories.findOne({
        where: {
            [Op.and] : {
                id_user: decoded.id,
                room_id: req.params.roomId,
                opt_1: '-',
                opt_2: '-',
                opt_3: '-'
            }
        }
    })

    if(dataUser){
        const dataOption = {
            time: 5,
            opt_1: req.body.opt_1,
            opt_2: req.body.opt_2,
            opt_3: req.body.opt_3
        }

        await User_game_histories.update(dataOption, {
            where: {
                id: dataUser.id
            }
        })

        const dataUserOpponent = await User_game_histories.findOne({
            where: {
                [Op.and] : {
                    id_user: {
                        [Op.notIn]: decoded.id
                    },
                    room_id: req.params.roomId
                }
            }
        })
        
        if(dataUserOpponent.opt_1 !== '-' || dataUserOpponent.opt_2 !== '-' || dataUserOpponent.opt_3 !== '-') {
            //Logic Game
            res.status(200).json({
                status: 'oke'
            })
        } else {
            res.status(200).json({
                status: 'Success Submit Option',
                Option1: req.body.opt_1,
                Option2: req.body.opt_2,
                Option3: req.body.opt_3
            })
        }
    } else {
        res.status(200).json({
            status: 'roomId Invalid or You Already Play Game, Please Check Status roomId'
        })
    }
}

const gameResult = async (req, res) => {
    const token = req.headers.authorization;
    const decoded = jwt_decode(token);

    const dataGame = await User_game_histories.findAll({
        attributes: [
            'id_user', 
            'room_id', 
            'opt_1',
            'opt_2',
            'opt_3',
            'result',
            'score'
        ],
        where: {
            [Op.or] : {
                [Op.and] : {
                    id_user: decoded.id,
                    room_id: req.params.roomId
                },
                [Op.and] : {
                    id_user: {
                        [Op.notIn]: decoded.id
                    },
                    room_id: req.params.roomId
                }
            }
        }
    }) 

    const data = dataGame.map(i => i);

    if(data.length > 0) {
        res.status(200).json({
            status: 'Game Result',
            data: dataGame 
        })
    } else {
        res.status(400).json({
            status: 'roomId Not Found' 
        })
    }
    
}

module.exports = { authenticationGame, createRoom, joinRoom, playGame, gameResult }