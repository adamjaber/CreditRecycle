const { Router } = require('express');
const { authController } = require('../controllers/authController');
const authRouter = new Router();

authRouter.post('/signup', authController.signup); 
authRouter.post('/login', authController.login);
module.exports = { authRouter };
