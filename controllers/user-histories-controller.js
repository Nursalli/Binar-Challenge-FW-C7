//Connect Models
const { User_games, User_game_histories } = require('../models');

//Third-Party Module
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');

//Handler
const index = async (req, res) => {
    const page = 'History Users Page';
    const title = 'History Users';

    const data = await User_game_histories.findAll({});

    res.render('dashboard/history-users', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        data,
        msg: req.flash('msg'),
        msgError: req.flash('msgError')
    });
}

const add = async (req, res) => {
    const page = 'History Users Page';
    const title = 'Add History Users';

    const dataUserGames = await User_games.findAll({
        where: {
            role: {
                [Op.ne] : 'Super User'
            }
        }
    });

    res.render('dashboard/add/add-history-user', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        dataUserGames
    });
}

const checkUser = (user_id) => {
    return User_games.findOne({
        where: {
            [Op.and] : {
                id: {
                    [Op.eq] : user_id
                },
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    })
}

const addPost = async (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const page = 'History Users Page';
        const title = 'Add History Users';

        const dataUserGames = await User_games.findAll({
            where: {
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        });

        res.render('dashboard/add/add-history-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            dataUserGames,
            errors: errors.array()
        });
    } else {
        User_game_histories.create(req.body)
            .then((data) => {
                req.flash('msg', 'Data History Created!');
                res.redirect('/dashboard/history-users');
            });
    }
}

const findUserHistories = (id) => {
    return User_game_histories.findOne({
        where: {
            id : id
        }
    })
}

const deletePost = async (req, res) => {
    const user = await findUserHistories(req.params.id);
    
    if(user){
        User_game_histories.destroy({
            where: {
                id: req.params.id
            }
        })
            .then((data) => {
                req.flash('msg', 'History User Deleted!');
                res.redirect('/dashboard/history-users');
            });
    }else{
        req.flash('msgError', 'History User Not Found!');
        res.redirect('/dashboard/history-users');
    }
}

module.exports = { index, checkUser, add, addPost, deletePost }