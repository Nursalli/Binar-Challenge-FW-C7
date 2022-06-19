//Third-Party Module
const jwt = require('jsonwebtoken');
require("dotenv").config();

//Handler
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; 
    if(token !== null){
        jwt.verify(token, process.env.JWT_KEY, (err) => {
            if(err) {
                res.status(500).json({
                    error: err 
                })
            }
            next();
        })
    } else {
        // res.status(401).json({
        //     status: 'Login Required'
        // });
        res.redirect('/');
    }
    // res.send(authHeader);
}

module.exports = { verifyToken }