// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the local connection URL
mongoose.connect('mongodb://localhost:27017/commentsDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});

// Define a Comment schema
const commentSchema = new mongoose.Schema({
    name: String,
    comment: String,
});

const Comment = mongoose.model('Comment', commentSchema);

// Routes
app.get('/comments', async (req, res) => {
    try {
        const comments = await Comment.find();
        res.json(comments);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.post('/comments', async (req, res) => {
    const { name, comment } = req.body;
    const newComment = new Comment({ name, comment });
    try {
        await newComment.save();
        res.status(201).json(newComment);
    } catch (err) {
        res.status(500).send(err);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
