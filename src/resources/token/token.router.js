const express = require('express');
const controller = require('../../controllers/token');

const router = express.Router();


router.post('/token', controller.postRefreshToken);


module.exports = router; 