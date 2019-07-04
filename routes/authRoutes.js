const express = require('express');
const router = express.Router();

const AuthCtrl = require('../controllers/auth');

router.post('/signup', AuthCtrl.CreateUser);
router.post('/login', AuthCtrl.LoginUser);

module.exports = router;