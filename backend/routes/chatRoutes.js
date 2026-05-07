const express = require('express');
const router = express.Router();
const { getConversations, getChatHistory, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getConversations)
  .post(protect, sendMessage);

router.route('/:userId')
  .get(protect, getChatHistory);

module.exports = router;
