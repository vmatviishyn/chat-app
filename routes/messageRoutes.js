const express = require('express');
const router = express.Router();

const MessagesCtrl = require('../controllers/message');
const AuthHelper = require('../helpers/authHelper');

router.post('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.verifyToken, MessagesCtrl.sendMessage);
router.get('/chat-messages/:sender_Id/:receiver_Id', AuthHelper.verifyToken, MessagesCtrl.getAllMessages);
router.get('/receivers-messages/:sender/:receiver', AuthHelper.verifyToken, MessagesCtrl.markReceiverMessages);
router.get('/mark-all-messages', AuthHelper.verifyToken, MessagesCtrl.markAllMessages);


module.exports = router;