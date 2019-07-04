const express = require('express');
const router = express.Router();

const UserCtrl = require('../controllers/users');
const AuthHelper = require('../helpers/authHelper');

router.get('/users', AuthHelper.verifyToken, UserCtrl.getAllUsers);
router.get('/user/:id', AuthHelper.verifyToken, UserCtrl.getUser);
router.get('/username/:username', AuthHelper.verifyToken, UserCtrl.getUserByName);
router.post('/user/view-profile', AuthHelper.verifyToken, UserCtrl.profileView);
router.post('/change-password', AuthHelper.verifyToken, UserCtrl.changePassword);

module.exports = router;