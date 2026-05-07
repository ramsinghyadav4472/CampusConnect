const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  subject: {
    type: String,
    required: [true, 'Please add a subject']
  },
  semester: {
    type: String,
    required: [true, 'Please add a semester']
  },
  condition: {
    type: String,
    required: [true, 'Please add a condition']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  originalPrice: {
    type: Number
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  tags: [String],
  images: [String],
  isAvailable: {
    type: Boolean,
    default: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
