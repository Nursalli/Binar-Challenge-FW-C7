//Third-Party Module
const express = require('express');
const routerDashboard = express.Router();

//Contoller
const { index } = require('../controllers/dashboard-controller');
const restrict = require('../middleware/restrict');

//Endpoint Router
routerDashboard.get('/', restrict, index);

module.exports = { routerDashboard };