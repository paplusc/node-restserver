const jwt = require('jsonwebtoken');

// Verify token
let verifyToken = (req, res, next) => {

    let token = req.get('authorization');

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Not valid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });

};

// Verify admin role
let verifyAdminRole = (req, res, next) => {

    let user = req.user;

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'Only admin users can do this'
            }
        });
    }
    next();

};

// Verify token IMG
let verifyTokenImg = (req, res, next) => {

    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Not valid token'
                }
            });
        }

        req.user = decoded.user;
        next();
    });

};
module.exports = {
    verifyToken,
    verifyAdminRole,
    verifyTokenImg
}