const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

// =======================
// MongoDB Connection
// =======================
mongoose.connect(
  'mongodb+srv://skjha9th:Saurabhjha@cluster0.ewg8cxv.mongodb.net/commentsDB?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
)
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

// =======================
// Comment Schema
// =======================
const CommentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    comment: {
      type: String,
      required: true
    },
    pageUrl: {
      type: String,
      required: true
    },
    pageTitle: {
      type: String,
      required: true
    }
  },
  { timestamps: true } // adds createdAt & updatedAt
);

const Comment = mongoose.model('Comment', CommentSchema);

// =======================
// Express App Setup
// =======================
const app = express();
app.use(cors());
app.use(bodyParser.json());

// =======================
// Routes
// =======================

// 👉 Get comments for a specific page
// Example: /comments?pageUrl=/blogs/mern-auth
app.get('/comments', async (req, res) => {
  try {
    const { pageUrl } = req.query;

    if (!pageUrl) {
      return res.status(400).json({ message: 'pageUrl is required' });
    }

    const comments = await Comment.find({ pageUrl })
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// 👉 Post a comment
app.post('/comments', async (req, res) => {
  try {
    const { name, comment, pageUrl, pageTitle } = req.body;

    if (!name || !comment || !pageUrl || !pageTitle) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newComment = new Comment({
      name,
      comment,
      pageUrl,
      pageTitle
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error saving comment' });
  }
});

// 👉 Delete a comment (Admin use)
app.delete('/comments/:id', async (req, res) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(req.params.id);

    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

// =======================
// Server Start
// =======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
