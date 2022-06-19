//Third-Party Module
const express = require('express');
const routerDashboard = express.Router();

//Contoller
const { index } = require('../controllers/dashboard-controller');

//Endpoint Router
routerDashboard.get('/', index);

module.exports = { routerDashboard };