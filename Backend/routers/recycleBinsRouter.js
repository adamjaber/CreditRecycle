const { Router } = require('express');
const { recycleBinsController } = require('../controllers/recycleBinsController');
const recycleBinsRouter = new Router();

recycleBinsRouter.get('/', recycleBinsController.getRecycleBins); 
recycleBinsRouter.get('/:id', recycleBinsController.getRecycleBinDetails);  
recycleBinsRouter.patch('/:id', recycleBinsController.editRecycleBinDetails); 
recycleBinsRouter.post('/', recycleBinsController.addRecycleBin); 
recycleBinsRouter.delete('/:id', recycleBinsController.deleteRecycleBin); 
module.exports = { recycleBinsRouter };

