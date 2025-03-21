const jwt = require('jsonwebtoken');
const config = require('../config/setting.json');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.jwt.secret);
        req.userData = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            auth: false,
            message: 'Authentication failed'
        });
    }
};