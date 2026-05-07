const asyncHandler = require('express-async-handler');
const Message = require('../models/Message');

// @desc    Get all conversations for the current user
// @route   GET /api/chats
// @access  Private
const getConversations = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;

  const messages = await Message.find({
    $or: [{ sender: currentUserId }, { receiver: currentUserId }]
  })
  .populate('sender', 'name')
  .populate('receiver', 'name')
  .populate('book', 'title')
  .sort({ createdAt: 1 });

  const conversationsMap = {};
  
  messages.forEach(msg => {
    const isSender = msg.sender._id.toString() === currentUserId;
    const otherUser = isSender ? msg.receiver : msg.sender;
    if (!otherUser) return;
    
    const otherUserId = otherUser._id.toString();
    
    if (!conversationsMap[otherUserId]) {
      conversationsMap[otherUserId] = {
        id: otherUserId,
        otherUser: {
          id: otherUserId,
          name: otherUser.name,
          isOnline: true
        },
        bookTitle: msg.book ? msg.book.title : 'General Inquiry',
        lastMessage: msg.text,
        lastMessageTime: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        unread: !isSender && !msg.isRead ? 1 : 0,
        messages: []
      };
    } else {
      conversationsMap[otherUserId].lastMessage = msg.text;
      conversationsMap[otherUserId].lastMessageTime = new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      if (!isSender && !msg.isRead) {
         conversationsMap[otherUserId].unread += 1;
      }
      if (msg.book) {
         conversationsMap[otherUserId].bookTitle = msg.book.title;
      }
    }
    
    conversationsMap[otherUserId].messages.push({
      id: msg._id,
      senderId: isSender ? 'current' : otherUserId,
      text: msg.text,
      time: new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
      date: new Date(msg.createdAt).toISOString().split('T')[0]
    });
  });

  const conversations = Object.values(conversationsMap).reverse();
  res.status(200).json(conversations);
});

// @desc    Get chat history between current user and another user
// @route   GET /api/chats/:userId
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
  const currentUserId = req.user.id;
  const otherUserId = req.params.userId;

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: otherUserId },
      { sender: otherUserId, receiver: currentUserId }
    ]
  })
  .populate('sender', 'name')
  .populate('receiver', 'name')
  .sort({ createdAt: 1 });

  res.status(200).json(messages);
});

// @desc    Send a message
// @route   POST /api/chats
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, text, bookId } = req.body;

  if (!receiverId || !text) {
    res.status(400);
    throw new Error('Please provide receiver and text');
  }

  const message = await Message.create({
    sender: req.user.id,
    receiver: receiverId,
    book: bookId,
    text
  });

  res.status(201).json({
    id: message._id,
    text: message.text,
    time: new Date(message.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
  });
});

module.exports = {
  getConversations,
  getChatHistory,
  sendMessage
};
