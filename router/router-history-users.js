//Third-Party Module
const express = require('express');
const routerHistoryUsers = express.Router();
const { body } = require('express-validator');

//Contoller
const { index, checkUser, add, addPost, deletePost } = require('../controllers/user-histories-controller');
const restrict = require('../middleware/restrict');

//Endpoint Router
routerHistoryUsers.get('/', restrict, index);

routerHistoryUsers.get('/add', restrict, add);

routerHistoryUsers.post('/add', restrict,
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

routerHistoryUsers.delete('/delete/:id', restrict, deletePost);

module.exports = { routerHistoryUsers }