//Connect Models
const { User_game_histories } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const randomstring = require('randomstring');
const jwt_decode = require('jwt-decode');

const dataAuthorization = (auth) => {
    const token = auth;
    const data = jwt_decode(token);

    return data
}

//API
module.exports = {
    authenticationGame: (req, res, next) => {
        const errors = validationResult(req);
            if(!errors.isEmpty()){
                res.status(400).json({
                    errors: errors.array()
                })
            }
        next()
    },
    createRoom: async (req, res) => {
        const decoded = dataAuthorization(req.headers.authorization);
        
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
    },
    joinRoom: async (req, res) => {
        const decoded = dataAuthorization(req.headers.authorization);
    
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
    },
    playGame: async (req, res) => {
        const decoded = dataAuthorization(req.headers.authorization);
    
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
    
            const dataUserNew = await User_game_histories.findOne({
                where: {
                    [Op.and] : {
                        id_user: decoded.id,
                        room_id: req.params.roomId
                    }
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
                let yourResult = 0;
                let opponentResult = 0;
    
                const yourData = [dataUserNew.opt_1, dataUserNew.opt_2, dataUserNew.opt_3];
                const opponentData = [dataUserOpponent.opt_1, dataUserOpponent.opt_2, dataUserOpponent.opt_3];
    
                for(let i = 0; i < yourData.length; i++){
                    if(yourData[i] === opponentData[i]){
                        yourResult += 0;
                        opponentResult += 0;
                    } else if (yourData[i] === 'R'){
                        if(opponentData[i] === 'S'){
                            yourResult += 100;
                        } else {
                            opponentResult += 100;
                        }
                    } else if (yourData[i] === 'S'){
                        if(opponentData[i] === 'R'){
                            opponentResult += 100;
                        } else {
                            yourResult += 100;
                        }
                    } else if (yourData[i] === 'P'){
                        if(opponentData[i] === 'R'){
                            yourResult += 100;
                        } else {
                            opponentResult += 100;
                        }
                    } else {
                        res.status(200).json({
                            status: 'Invalid Result'
                        })
                    }
                }
    
                let yourFinalResult = {};
                let opponentFinalResult = {};
    
                if(yourResult === opponentResult){
                    yourFinalResult = {
                        result: 'Draw',
                        score: yourResult
                    }
    
                    opponentFinalResult = {
                        result: 'Draw',
                        score: opponentResult
                    }
                } else if (yourResult > opponentResult){
                    yourFinalResult = {
                        result: 'Win',
                        score: yourResult
                    }
    
                    opponentFinalResult = {
                        result: 'Lose',
                        score: opponentResult
                    }
                } else {
                    yourFinalResult = {
                        result: 'Lose',
                        score: yourResult
                    }
    
                    opponentFinalResult = {
                        result: 'Win',
                        score: opponentResult
                    }
                }
    
                await User_game_histories.update(yourFinalResult, {
                    where: {
                        id: dataUserNew.id
                    }
                })
    
                await User_game_histories.update(opponentFinalResult, {
                    where: {
                        id: dataUserOpponent.id
                    }
                })
    
                res.status(200).json({
                    status: 'Success Submit Option',
                    Option1: req.body.opt_1,
                    Option2: req.body.opt_2,
                    Option3: req.body.opt_3
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
    },
    gameResult: async (req, res) => {
        const decoded = dataAuthorization(req.headers.authorization);
    
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
    
        let yourResult = {};
        let opponentResult = {};
    
        dataGame.map(i => i.id_user === decoded.id ? yourResult = i : opponentResult = i)
    
        if(yourResult.opt_1 === '-' || yourResult.opt_2 === '-' || yourResult.opt_3 === '-'){
            res.status(200).json({
                status: 'Game Result',
                YourResult: yourResult,
                OpponentResult: '-'
            })
        } else {
            res.status(200).json({
                status: 'Game Result',
                YourResult: yourResult,
                OpponentResult: opponentResult
            })
        }
    }
}