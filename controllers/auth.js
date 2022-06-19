//Connect Models
const { User_games } = require('../models');

//Third-Party Module
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

const authentication = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        req.flash('msg', "Username/Password Can't be Empty!");
        res.redirect('/');
    } else {
        const username = req.body.username;
        const password = req.body.password;

        const checkUsername = await User_games.findOne({
            where: {
                username
            }
        });

        if(checkUsername){
            const checkPassword = bcrypt.compareSync(password, checkUsername.password);
            const checkSuperUser = (checkUsername.role === 'Super User') ? true : false;

            if(checkPassword && checkSuperUser){
                const userToken = {
                    id: checkUsername.id,
                    username: checkUsername.username
                }

                jwt.sign({ userToken }, process.env.JWT_KEY, {
                    expiresIn: '20s'
                }, (err, token) => {
                    // res.status(200).json({ token: token });
                    // res.setHeader('Authorization', 'Bearer '+ token);
                    res.redirect('/dashboard');
                });

            } else {
                req.flash('msg', 'Wrong Username/Password!');
                res.redirect('/');
            }
        } else {
            req.flash('msg', 'Wrong Username/Password!');
            res.redirect('/');
        }

    }
}

const logout = (req, res) => {
    res.redirect('/');
}

module.exports = { index, authentication, logout }