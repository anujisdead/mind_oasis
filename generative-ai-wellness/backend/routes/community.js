const express = require('express');
const router = express.Router();
const CommunityPost = require('../models/CommunityPost');
const auth = require('../middleware/auth');

// --- Create post ---
router.post('/', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "text required" });

    const post = await CommunityPost.create({
      userId: req.user.id,
      userName: req.user.name,
      text
    });

    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to create post" });
  }
});

// --- Get all posts ---
router.get('/', auth, async (req, res) => {
  try {
    const posts = await CommunityPost.find()
      .sort({ createdAt: -1 })
      .lean();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "failed to fetch posts" });
  }
});

// --- React to post ---
router.post('/:id/react', auth, async (req, res) => {
  try {
    const { type } = req.body;
    if (!["like", "love", "support", "insightful"].includes(type)) {
      return res.status(400).json({ error: "invalid reaction" });
    }

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });

    // prevent duplicate reaction by same user
    post.reactions = post.reactions.filter(r => r.userId.toString() !== req.user.id);
    post.reactions.push({ userId: req.user.id, type });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "failed to react" });
  }
});

// --- Add comment ---
router.post('/:id/comment', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "comment text required" });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });

    post.comments.push({
      userId: req.user.id,
      userName: req.user.name,
      text
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "failed to add comment" });
  }
});

// --- Reply to a comment ---
router.post('/:postId/comment/:commentId/reply', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: "reply text required" });

    const post = await CommunityPost.findById(req.params.postId);
    if (!post) return res.status(404).json({ error: "post not found" });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ error: "comment not found" });

    comment.replies.push({
      userId: req.user.id,
      userName: req.user.name,
      text
    });

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "failed to add reply" });
  }
});

module.exports = router;
