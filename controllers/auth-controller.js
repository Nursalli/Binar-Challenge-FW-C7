//Connect Models
const { User_games, User_game_biodata } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');

//Handler
const index = (req, res) => {
    const page = 'Login Page';
    const author = 'Muhammad Nursalli';
    const copyrightYear = new Date().getFullYear();

    res.render('index', {
        layout: false,
        page,
        author, 
        copyrightYear,
        msg: req.flash('msg')
    });
}

const authentication = (req, res, next) => {

    const errors = validationResult(req);

        if(!errors.isEmpty()){
            req.flash('msg', "Username/Password Can't be Empty!");
            res.redirect('/');
        }

    next()
}

const logout = (req, res) => {
    req.session.destroy(()=>{
        res.clearCookie('connect.sid');
        res.redirect('/');
    });
}

//API
const authenticationAuth = (req, res, next) => {

    const errors = validationResult(req);

        if(!errors.isEmpty()){
            res.status(400).json({
                errors: errors.array()
            })
        }

    next()
}

const registerAPI = async (req, res) => {
    await User_games.register({
        username: req.body.username,
        password: req.body.password
    });

    const country = req.body.country;

    let newData = {};

    let data = await User_games.findAll();
    data = data.map(i => i);

    if(country === ""){
        newData = {
            id_user: data[data.length - 1].id,
            name: req.body.name,
            email: req.body.email,
            birthdate: req.body.birthdate
        }
    } else {
        newData = {
            id_user: data[data.length - 1].id,
            name: req.body.name,
            email: req.body.email,
            birthdate: req.body.birthdate,
            country: req.body.country
        }
    }

    await User_game_biodata.create(newData);

    res.status(200).json({
        status: 'Registered, Please Login'
    });
}

const loginAPI = async (req, res) => {
    try{
        const user = await User_games.authenticateAPI(req.body);

        const { id, username } = user;
        const token = await User_games.generateToken(user);

        res.status(200).json({
            status: 'logged in',
            id,
            username,
            token
        });
    } catch (err) {
        res.status(400).json({
            status: 'Wrong Username/Password!'
        });
    }
}

module.exports = { index, authentication, logout, authenticationAuth, registerAPI, loginAPI }