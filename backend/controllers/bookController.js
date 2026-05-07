const asyncHandler = require('express-async-handler');
const Book = require('../models/Book');

// @desc    Get all books with filtering and pagination
// @route   GET /api/books
// @access  Private
const getBooks = asyncHandler(async (req, res) => {
  const { search, minPrice, maxPrice, sortBy } = req.query;
  const subjects = req.query.subjects || req.query['subjects[]'];
  const semesters = req.query.semesters || req.query['semesters[]'];
  const conditions = req.query.conditions || req.query['conditions[]'];

  let query = { isAvailable: true };

  // University Isolation: Only show books from sellers in the same university
  const User = require('../models/User');
  const usersInUniversity = await User.find({ university: req.user.university }).select('_id');
  const userIds = usersInUniversity.map(u => u._id);
  query.seller = { $in: userIds };

  // Filtering
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { tags: { $regex: search, $options: 'i' } },
      { subject: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (subjects) {
    query.subject = { $in: Array.isArray(subjects) ? subjects : [subjects] };
  }
  if (semesters) {
    query.semester = { $in: Array.isArray(semesters) ? semesters : [semesters] };
  }
  if (conditions) {
    query.condition = { $in: Array.isArray(conditions) ? conditions : [conditions] };
  }
  
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // Sorting
  let sortObj = { createdAt: -1 }; // Default to newest
  if (sortBy === 'price-asc') sortObj = { price: 1 };
  if (sortBy === 'price-desc') sortObj = { price: -1 };
  if (sortBy === 'popular') sortObj = { views: -1 };

  // Pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const books = await Book.find(query)
    .populate('seller', 'name university')
    .sort(sortObj)
    .skip(skip)
    .limit(limit);

  const total = await Book.countDocuments(query);

  res.status(200).json({
    books,
    page,
    pages: Math.ceil(total / limit),
    total
  });
});

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Private
const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('seller', 'name university rating totalSales');

  if (book) {
    // Enforce university isolation
    if (book.seller && book.seller.university !== req.user.university) {
      res.status(403);
      throw new Error('Access denied: Book belongs to another university');
    }

    // Increment views
    book.views += 1;
    await book.save();
    res.status(200).json(book);
  } else {
    res.status(404);
    throw new Error('Book not found');
  }
});

// @desc    Create a book listing
// @route   POST /api/books
// @access  Private
const createBook = asyncHandler(async (req, res) => {
  const { title, subject, semester, condition, price, originalPrice, description, tags, images } = req.body;

  if (!title || !subject || !price || !description) {
    res.status(400);
    throw new Error('Please add all required fields');
  }

  const book = await Book.create({
    title,
    subject,
    semester,
    condition,
    price,
    originalPrice,
    description,
    tags,
    images,
    seller: req.user.id
  });

  res.status(201).json(book);
});

// @desc    Update a book listing
// @route   PUT /api/books/:id
// @access  Private
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user is the seller
  if (book.seller.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.status(200).json(updatedBook);
});

// @desc    Delete a book listing
// @route   DELETE /api/books/:id
// @access  Private
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);

  if (!book) {
    res.status(404);
    throw new Error('Book not found');
  }

  // Check if user is the seller
  if (book.seller.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await book.deleteOne();
  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook
};
