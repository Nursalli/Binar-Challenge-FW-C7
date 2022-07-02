//Router
const routerPlayerAuth = require('./router-player-auth'); 
const routerPlayerGame = require('./router-player-game'); 

const router = (app) => {
    app.use('/api/player', routerPlayerAuth);
    app.use('/api/player/game', routerPlayerGame);
}

module.exports = router