const User = require('../models/users');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.userService = {
    async isModerator(userId) {
        infoLogger.info("Checking isModerator");
        let user;
        try {
            user = await User.findOne({ _id: userId });
        } catch (err) {
            return false;
        }
        return !(!user || (!user.userType.operationalManager && !user.userType.admin));
    }
};