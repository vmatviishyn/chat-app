const express = require('express');
const router = express.Router();

const FriendCtrl = require('../controllers/friends');
const AuthHelper = require('../helpers/authHelper');

router.post('/follow-user', AuthHelper.verifyToken, FriendCtrl.followUser);
router.post('/unfollow-user', AuthHelper.verifyToken, FriendCtrl.unfollowUser);
router.post('/mark/:id', AuthHelper.verifyToken, FriendCtrl.markNotification);
router.post('/mark-all', AuthHelper.verifyToken, FriendCtrl.markAllNotifications);

module.exports = router;