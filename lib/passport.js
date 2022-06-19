const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User_games } = require('../models');

const authenticate = async(username, password, done) => {
    try{
        const user = await User_games.authenticate({
            username, 
            password
        })

        return done(null, user)
    }
    catch(err){
        return done(null, false, { msg: err.message })
    }
}

passport.use(
    new LocalStrategy({ 
        usernameField: 'username', 
        passwordField: 'password' 
    },authenticate)
)

passport.serializeUser(
    (user, done) => {
       return done(null, user.id)
    }
)

passport.deserializeUser(
    async (id, done) => {
        return done(null, await User_games.findByPk(id))
    }
)
    
module.exports = passport