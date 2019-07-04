const express = require('express');
const router = express.Router();

const PostCtrl = require('../controllers/posts');
const AuthHelper = require('../helpers/authHelper');

router.post('/post/add-post', AuthHelper.verifyToken, PostCtrl.addPost);
router.post('/post/add-like', AuthHelper.verifyToken, PostCtrl.addLike);
router.post('/post/add-comment', AuthHelper.verifyToken, PostCtrl.addComment);

router.get('/posts', AuthHelper.verifyToken, PostCtrl.getAllPosts);
router.get('/post/:id', AuthHelper.verifyToken, PostCtrl.getPost);

module.exports = router;