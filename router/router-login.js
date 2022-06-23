//Third-Party Module
const express = require('express');
const routerLogin = express.Router();
const { body } = require('express-validator');
const passport = require('../lib/passport-local');

//Contoller
const { index, authentication, logout } = require('../controllers/auth-controller');

//Endpoint Router
routerLogin.get('/', index);

routerLogin.post('/', 
    [
        body('username').notEmpty(),
        body('password').notEmpty()
    ],
    authentication, passport.authenticate('local', {
            successRedirect: '/dashboard',
            failureRedirect: '/',
            failureFlash: true
        }));

routerLogin.get('/logout', logout);

module.exports = routerLogin