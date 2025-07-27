const express = require('express');
const router = express.Router();
const notifCtrl = require('../controllers/notification.controller');
const auth = require('../middleware/auth');

router.get('/', auth, notifCtrl.getNotifications);

module.exports = router;
