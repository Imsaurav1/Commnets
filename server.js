const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// =======================
// MongoDB Connection
// =======================
mongoose.connect(
  'system123',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// =======================
// Schema
// =======================
const CommentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    comment: { type: String, required: true },
    pageUrl: { type: String, required: true },
    pageTitle: { type: String, required: true }
  },
  { timestamps: true } // 👈 auto createdAt
);

const Comment = mongoose.model('Comment', CommentSchema);

// =======================
// Routes
// =======================

// POST comment
app.post('/comments', async (req, res) => {
  try {
    const { name, comment, pageUrl, pageTitle } = req.body;

    if (!name || !comment || !pageUrl || !pageTitle) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const newComment = new Comment({
      name,
      comment,
      pageUrl,
      pageTitle
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET comments for ONE page only
app.get('/comments', async (req, res) => {
  try {
    const { pageTitle } = req.query;

    if (!pageUrl) {
      return res.status(400).json({ message: 'pageTitle required' });
    }

    const comments = await Comment.find({ pageTitle })
      .sort({ createdAt: -1 }); // 👈 newest first

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);


