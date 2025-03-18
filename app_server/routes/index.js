const express = require('express');
const router = express.Router();
const mainController = require('../Controllers/main');

// Route to render the travel page
router.get('/travel', mainController.renderTravelPage);

module.exports = router;
