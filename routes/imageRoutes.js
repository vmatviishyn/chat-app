const express = require('express');
const router = express.Router();

const ImageCtrl = require('../controllers/images');
const AuthHelper = require('../helpers/authHelper');

router.post('/upload-image', AuthHelper.verifyToken, ImageCtrl.uploadImage);
router.get('/set-default-image/:imgId/:imgVersion', AuthHelper.verifyToken, ImageCtrl.setDefaultImage);

module.exports = router;