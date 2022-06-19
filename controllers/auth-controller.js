//Connect Models
// const { User_games } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

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

module.exports = { index, authentication, logout }