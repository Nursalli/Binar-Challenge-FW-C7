const express = require('express');
const routerBiodataUsers = express.Router();
const { body } = require('express-validator');

//Contoller
const { index, add, checkUser, duplicateUserBiodata, duplicateEmailBiodata, duplicateEmailNewBiodata, checkBirthdateBiodata, addPost, 
    edit, findUserBiodata, editPost, deletePost } = require('../controllers/user-biodata');

routerBiodataUsers.get('/', index);

routerBiodataUsers.get('/add', add);

routerBiodataUsers.post('/add', 
    [
        body('id_user').custom(async (data) => {
            const checkUserGames = await checkUser(parseInt(data));
            const checkUserBiodata = await duplicateUserBiodata(parseInt(data));
            if(checkUserGames && checkUserBiodata){
                throw new Error('Biodata User Already Exists');
            }else if(!checkUserGames){
                throw new Error('User Invalid');
            } else {
                return true;
            }
        }),
        body('id_user').notEmpty(),
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
    addPost);

routerBiodataUsers.get('/edit/:id', edit);

routerBiodataUsers.put('/edit/:id', 
    [
        body('id_user').custom(async (data, { req }) => {
            const checkUserGames = await checkUser(parseInt(data));
            const checkUserBiodataById = await findUserBiodata(parseInt(req.params.id));
            const checkUserBiodata = await duplicateUserBiodata(parseInt(data));
            if(checkUserBiodataById.id_user !== parseInt(req.body.id_user) && checkUserBiodata){
                throw new Error('Biodata Already Exists');
            }else if(!checkUserGames){
                throw new Error('User Invalid');
            }else{
                return true;
            }
        }),
        body('id_user').notEmpty(),
        body('email').custom(async (data, { req }) => {
            const checkEmailBiodata = await duplicateEmailBiodata(data);
            const checkEmailNewBiodata = await duplicateEmailNewBiodata(parseInt(req.params.id), data);
            const checkUserBiodata = await duplicateUserBiodata(parseInt(req.body.id_user));
            const checkUserBiodataById = await findUserBiodata(parseInt(req.params.id));
            if(checkUserBiodata == null && checkUserBiodataById.email === req.body.email){
                return true;
            }else if(checkUserBiodata == null && checkEmailNewBiodata) {
                throw new Error('Email Already Exists');
            }else if(checkUserBiodata.email !== req.body.email && checkEmailBiodata){
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
    editPost);

routerBiodataUsers.delete('/delete/:id', deletePost);

module.exports = { routerBiodataUsers }