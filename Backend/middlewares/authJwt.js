const jwt = require('jsonwebtoken');
const { SECRET } = require('../constants');

verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }
    jwt.verify(token, SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        next();
    });
};

verifyModerator = (req, res, next) => {
    User.findOne({ _id: req.userId })
        .then((user) => {
            if (!user || !user.moderator) {
                errorLogger.error(`user has no moderator permissions ${req.userId}`);
                res.status(403).json({ "message": `Require Moderator Permissions!` });
            }
            next();
        })
        .catch(err => {
            errorLogger.error(`Error Getting user from db:${err}`);
            res.status(403).json({ "message": `Access Denied!` });
        });
};

const authJwt = {
    verifyToken,
    verifyModerator,
};

module.exports = authJwt;