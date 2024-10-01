

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

mongoose.connect('mongodb+srv://skjha9th:Saurabhjha@cluster0.ewg8cxv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const CommentSchema = new mongoose.Schema({
  name: String,
  comment: String,
}, { timestamps: true });

const Comment = mongoose.model('Comment', CommentSchema);

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Get all comments
app.get('/comments', async (req, res) => {
  const comments = await Comment.find();
  res.json(comments);
});

// Post a comment
app.post('/comments', async (req, res) => {
  const newComment = new Comment(req.body);
  await newComment.save();
  res.json(newComment);
});

// Delete a comment
app.delete('/comments/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(deletedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
