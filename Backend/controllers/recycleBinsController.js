const RecycleBin = require('../models/recycleBins');
const { infoLogger, errorLogger } = require("../logs/logs");
const { userService } = require('../services/userService');

exports.recycleBinsController = {
    getRecycleBins(req, res) {
        infoLogger.info("Get all RecycleBins");
        RecycleBin.find({})
            .then(recycleBin => {
                infoLogger.info("Success to Get all recycleBins");
                res.json(recycleBin)
            })
            .catch(err => {
                errorLogger.error(`Error getting the data from db:${err}`)
                res.status(500).json({ "message": `Error Gets recycleBins ` });
            });
    },
    getRecycleBinDetails(req, res) {
        infoLogger.info(`Get recycleBin id:${req.params.id}`);
        RecycleBin.findOne({ _id: req.params.id })
            .then((recycleBin) => {
                if (recycleBin) {
                    res.json(recycleBin)
                }
                else {
                    errorLogger.error("Wrong recycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong recycleBin id please enter correct id" });
                }
            })
            .catch(err => {
                errorLogger.error(`Error Getting recycleBin from db:${err}`);
                res.status(500).json({ "message": `Error getting recycle bin` });
            });
    },
    async editRecycleBinDetails(req, res) {
        infoLogger.info("Updating a recycleBin");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
        RecycleBin.updateOne({ _id: req.params.id }, req.body)
            .then((result) => {
                if (result.matchedCount > 0) {
                    infoLogger.info(`Updating RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Updating RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error("Wrong RecycleBin id please enter correct id");
                    res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" });
                }
            })
            .catch((err) => res.status(400).json({ "message": "Wrong RecycleBin id please enter correct id" }));
    },
    async addRecycleBin(req, res) {
        infoLogger.info("Add a recycleBin");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
        const newRecycleBin = new RecycleBin(req.body);
        newRecycleBin.save()
            .then(result => {
                infoLogger.info(`Adding RecycleBin in   :${req.body.location} is successfully`);
                res.json(result);
            })
            .catch(err => {
                errorLogger.error(`Error Adding RecycleBin `);
                res.status(400).json({ "message": `Error Adding RecycleBin ` });
            });
    },
    async deleteRecycleBin(req, res) {
        infoLogger.info("Delete a RecycleBin");
        let isMod = false;
        if (req.userId) {
            isMod = await userService.isModerator(req.userId);
        }
        if (!isMod) {
            errorLogger.error(`unauthorized user ${req.userId}`);
            res.status(401).json({ "message": "Unauthorized user" });
            return;
        }
        RecycleBin.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount > 0) {
                    infoLogger.info(`Deleting RecycleBin no:${req.params.id} is successfully`);
                    res.json({ "message": `Deleting RecycleBin no:${req.params.id} is successfully` });
                }
                else {
                    errorLogger.error(`RecycleBin no:${req.params.id} does not exists`);
                    res.status(400).json({ "message": `RecycleBin no:${req.params.id} does not exists` });
                }
            })
            .catch(() => {
                errorLogger.error(`Error Deleting RecycleBin no:${req.params.id} `);
                res.status(400).json({ "message": `Error Deleting RecycleBin no:${req.params.id} ` });
            });
    }
}

