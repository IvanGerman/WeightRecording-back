const express = require('express');
const passport = require('passport');
const controller = require('../../controllers/members');

const router = express.Router();


//the callback function under can be replaced by controller
router.get('/members', passport.authenticate('jwt', { session: false }), controller.getMembers);

router.post('/members', passport.authenticate('jwt', { session: false }), controller.postMembers);

router.post('/members/weights/:member', passport.authenticate('jwt', { session: false }), controller.postWeight);

router.delete('/members/:member', passport.authenticate('jwt', { session: false }), controller.deleteMembers);

router.put('/members/:member', passport.authenticate('jwt', { session: false }), controller.updateWeight);



module.exports = router; 