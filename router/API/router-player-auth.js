const express = require('express');
const routerPlayerAuth = express.Router();
const { body } = require('express-validator');

//Contoller
const { duplicate } = require('../../controllers/user-games-controller');
const { duplicateEmailBiodata, checkBirthdateBiodata } = require('../../controllers/user-biodata-controller');
const { authenticationRegister, registerAPI, loginAPI } = require('../../controllers/auth-controller');

routerPlayerAuth.post('/api/player/register', 
    [
        body('username').custom(async (data) => {
            const check = await duplicate(data);
            if(check){
                throw new Error('Username Already Exists');
            }else{
                return true;
            }
        }),
        body('username').notEmpty(),
        body('password').isLength({ min: 5}),
        body('email').custom(async (data) => {
            const check = await duplicateEmailBiodata(data);
            if(check){
                throw new Error('Email Already Exists');
            }else{
                return true;
            }
        }),
        body('email').isEmail(),
        body('birthdate').custom(async (data) => {
            const check = await checkBirthdateBiodata(data);
            if(check){
                throw new Error('Birthdate Invalid');
            }else{
                return true;
            }
        }),
        body('birthdate').notEmpty()
    ], 
    authenticationRegister,
    registerAPI);

routerPlayerAuth.post('/login', loginAPI);

module.exports = { routerPlayerAuth }