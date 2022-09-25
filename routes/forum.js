var express = require('express');
var router = express.Router();

const message_controller = require('../controllers/messageController');
const user_controller = require('../controllers/userController');
const passport = require('passport');

///////// MESSAGE ROUTES ////////
router.get('/', message_controller.index);

router.post('/', message_controller.message_delete);

router.get('/message', message_controller.create_message_get);

router.post('/message', message_controller.create_message_post);

///////// USER ROUTES ///////////
router.get('/signup', user_controller.user_signup_get);

router.post('/signup', user_controller.user_signup_post);

router.get('/log-in', user_controller.user_login_get);

router.post('/log-in', user_controller.user_login_post);

router.get('/log-out', user_controller.user_log_out);

router.get('/membership', user_controller.user_member_get);

router.post('/membership', user_controller.user_member_post);

router.get('/adminship', user_controller.user_admin_get);

router.post('/adminship', user_controller.user_admin_post);

module.exports = router;
