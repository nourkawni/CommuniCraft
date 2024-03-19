const jwt = require('jsonwebtoken');


// Middleware for checking the JWT token to make sure that user is logged in
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer TOKEN


        jwt.verify(token, '1234', (err, user) => {
            if (err) {
                return res.status(403).json({ error: 'Token is not valid' });
            }
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({ error: 'Access denied. No token provided.' });
    }
};


module.exports = verifyToken;