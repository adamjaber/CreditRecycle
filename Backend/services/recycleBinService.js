const RecycleBin = require('../models/recycleBins');
const { infoLogger, errorLogger } = require("../logs/logs");

exports.recycleBinService = {
    async increaseCurrentCapacity(binId, capacity) {
        infoLogger.info(`Get recycleBin id:${binId}`);
        let recycleBin;
        let currentCapacityPlastic;
        let currentCapacityGlass;
        let currentCapacityCan;
        let result;
        let statusFlag=false;
        try {
            recycleBin = await RecycleBin.findOne({ _id: binId })
            if (!recycleBin) {
             

                errorLogger.error(`Wrong recycleBin id please enter correct id`);
                return false;
            }
        }
        catch (err) {
            errorLogger.error(`Error Getting recycleBin from db:${err}`);
            res.status(500).json({ "message": `Error getting recycle bin` });
        }
        currentCapacityPlastic = capacity.plastic;
        currentCapacityGlass = capacity.glass;
        currentCapacityCan = capacity.can;
        if (currentCapacityPlastic+5 >= recycleBin.maxCapacity || currentCapacityGlass+5 >= recycleBin.maxCapacity || currentCapacityCan+5 >= recycleBin.maxCapacity ) {
            statusFlag=true;
        }
        infoLogger.info("Increase current capacity a recycleBin");
        try {
            if(statusFlag==true){
                result = await RecycleBin.updateOne({ _id: binId }, { capacity: capacity,status:"inactive" })
            }
            else{
                result = await RecycleBin.updateOne({ _id: binId }, { capacity: capacity })
            }
            if (result.matchedCount > 0) {
                infoLogger.info(`Updating RecycleBin no:${binId} is successfully`);
                return true;
            }
            else {

                errorLogger.error("Wrong RecycleBin id please enter correct id");
                return false;
            }

        }
        catch (err) {
            return false;
        }
    },
}
