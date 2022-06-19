//Third-Party Module
const express = require('express');
const routerDataUsers = express.Router();
const { body } = require('express-validator');

//Contoller
const { index, duplicate, add, addPost, findUser, edit, editPost, deletePost } = require('../controllers/user-games-controller');
const restrict = require('../middleware/restrict');

//Endpoint Router
routerDataUsers.get('/', restrict, index);

routerDataUsers.get('/add', restrict, add);

routerDataUsers.post('/add', restrict,
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
        body('password').isLength({ min: 5})
    ],
    addPost);

routerDataUsers.get('/edit/:id', restrict, edit);

routerDataUsers.put('/edit/:id', restrict,
    [
        body('username').custom(async (data, { req }) => {
            const user = await findUser(parseInt(req.params.id));
            const check = await duplicate(data);
            if(user == null) {
                throw new Error('User Not Found!');
            }else if(user.username !== req.body.username && check){
                throw new Error('Username Already Exists');
            }else{
                return true;
            }
        }),
        body('username').notEmpty(),
        body('password').custom(data => {
            if(data.length !== 0 && data.length < 5){
                throw new Error('Password Must be at Least 5 Character');
            } else {
                return true;
            }
        })
    ],
    editPost);

routerDataUsers.delete('/delete/:id', restrict, deletePost);

module.exports = { routerDataUsers } 