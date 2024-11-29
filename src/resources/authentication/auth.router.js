const express = require('express');
const controller = require('../../controllers/auth');

const router = express.Router();

//the callback function under can be replaced by controller
router.post('/login', controller.login);

router.post('/register', controller.register)

module.exports = router;