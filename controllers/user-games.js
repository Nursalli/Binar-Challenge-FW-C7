//Connect Models
const { User_games, User_game_biodata, User_game_histories } = require('../models');

//Third-Party Module
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');

//Handler
const index = async (req, res) => {
    const page = 'Data Users Page';
    const title = 'Data Users';

    const data = await User_games.findAll({
        where: {
            role: {
                [Op.ne] : 'Super User'
            }
        }
    });

    res.render('dashboard/data-users', {
        layout: 'dashboard/layouts/main',
        page,
        title,
        data,
        msg: req.flash('msg'),
        msgError: req.flash('msgError')
    });
}

const duplicate = (username) => {
    return User_games.findOne({
        where: {
            username
        }
    });
}

const add = (req, res) => {
    const page = 'Data Users Page';
    const title = 'Add Data Users';

    res.render('dashboard/add/add-data-user', {
        layout: 'dashboard/layouts/main',
        page,
        title
    });
}

const addPost = (req, res) => {
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        const page = 'Data Users Page';
        const title = 'Add Data Users';

        res.render('dashboard/add/add-data-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            errors: errors.array()
        });
    } else {
        User_games.create({
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        })
            .then((data) => {
                req.flash('msg', 'Data User Created!');
                res.redirect('/dashboard/data-users');
            });
    }
}

const findUser = (id) => {
    return User_games.findOne({
        where: {
            [Op.and] : {
                id,
                role: {
                    [Op.ne] : 'Super User'
                }
            }
        }
    });
}

const edit = async (req, res) => {
    const page = 'Data Users Page';
    const title = 'Edit Data Users';

    const data = await findUser(parseInt(req.params.id));

    if(data){
        res.render('dashboard/edit/edit-data-user', {
            layout: 'dashboard/layouts/main',
            page,
            title,
            data
        });
    } else {
        req.flash('msgError', 'User Not Found!');
        res.redirect('/dashboard/data-users');
    }
}

const editPost = async (req, res) => {
    const errors = validationResult(req);

    const user = await findUser(parseInt(req.params.id));

    if(user){
        if(!errors.isEmpty()){
            const page = 'Data Users Page';
            const title = 'Edit Data Users';
    
            res.render('dashboard/edit/edit-data-user', {
                layout: 'dashboard/layouts/main',
                page,
                title,
                errors: errors.array(),
                data: {
                    id: req.params.id,
                    username: req.body.username
                }
            });
        } else {
            let newData = {};
    
            if(req.body.password.length > 0){
                newData = {
                    username: req.body.username,
                    password: bcrypt.hashSync(req.body.password, 10)
                }
            } else {
                newData = {
                    username: req.body.username
                }
            } 
    
            User_games.update(newData, {
                    where: {
                        id: req.params.id
                    }
                })
                    .then((data) => {
                        req.flash('msg', 'Data User Updated!');
                        res.redirect('/dashboard/data-users');
                    });
        }
    } else {
        req.flash('msgError', 'User Not Found!');
        res.redirect('/dashboard/data-users');
    }
}

const findBiodata = (user_id) => {
    return User_game_biodata.findOne({
        where: {
            id_user: user_id
        }
    });
}

const findHistory = (user_id) => {
    return User_game_histories.findOne({
        where: {
            id_user: user_id
        }
    });
}

const deletePost = async (req, res) => {
    const user = await findUser(req.params.id);

    const checkBiodata = await findBiodata(req.params.id);
    const checkHistory = await findHistory(req.params.id);
    
    if(checkBiodata || checkHistory){
        req.flash('msgError', 'User is Used in Another Table!');
        res.redirect('/dashboard/data-users');
    } else {
        if(user){
            User_games.destroy({
                where: {
                    id: req.params.id
                }
            })
                .then((data) => {
                    req.flash('msg', 'Data User Deleted!');
                    res.redirect('/dashboard/data-users');
                });
        }else{
            req.flash('msgError', 'User Not Found!');
            res.redirect('/dashboard/data-users');
        }
    }
}

module.exports = { index, duplicate, add, addPost, findUser, edit, editPost, deletePost }