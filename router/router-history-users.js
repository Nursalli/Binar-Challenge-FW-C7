//Third-Party Module
const express = require('express');
const routerHistoryUsers = express.Router();
const { body } = require('express-validator');

//Contoller
const { index, checkUser, add, addPost, deletePost } = require('../controllers/user-histories');

//Endpoint Router
routerHistoryUsers.get('/', index);

routerHistoryUsers.get('/add', add);

routerHistoryUsers.post('/add', 
    [
        body('id_user').custom(async (data) => {
            const checkUserGames = await checkUser(parseInt(data));
            if(!checkUserGames){
                throw new Error('User Invalid');
            }else {
                return true;
            }
        }),
        body('id_user').notEmpty(),
        body('time').isInt({ min: 1 }),
        body('score').isInt({ min: 1, max: 100 })
    ],
    addPost);

routerHistoryUsers.delete('/delete/:id', deletePost);

module.exports = { routerHistoryUsers }