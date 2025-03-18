const express = require('express');
const router = express.Router();
const tripsController = require('../controllers/trips'); // Import trips controller
const authController = require('../controllers/authentication'); // Import authentication controller
const jwt = require('express-jwt');
const auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: 'payload'
});

router
    .route('/login')
    .post(authController.login);

router
    .route('/register')
    .post(authController.register);

module.exports = router;
