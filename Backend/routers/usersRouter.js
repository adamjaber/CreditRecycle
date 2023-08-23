const { Router } = require('express');
const { usersController } = require('../controllers/usersController');
const usersRouter = new Router();

usersRouter.get('/', usersController.getUsers); 
usersRouter.get('/:id', usersController.getUserDetails);  
usersRouter.post('/:id/activities', usersController.addActivity);
usersRouter.post('/:id/addMunicipal', usersController.addMunicipalUser);
usersRouter.post('/:id/report', usersController.addReport);
usersRouter.put('/:id/updateUser', usersController.editUserDetails);
usersRouter.put('/:id/updateProfileUser', usersController.editUserDetails);
usersRouter.delete('/:id/deleteUser', usersController.deleteUser);

module.exports = { usersRouter };
