//Third-Party Module
const express = require('express');
const routerAPI = express.Router();
const routerPlayerAuth = require('./router-player-auth'); 

routerAPI.use('/api/player', routerPlayerAuth);

module.exports = { routerAPI }