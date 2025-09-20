const express = require("express");
const router = express.Router();
const CommunityPost = require("../models/CommunityPost");
const User = require("../models/User");
const auth = require("../middleware/auth");

// 🕒 helper to format "2 mins ago"
function timeSince(date) {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return interval + " years ago";
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return interval + " months ago";
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return interval + " days ago";
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return interval + " hours ago";
  interval = Math.floor(seconds / 60);
  if (interval > 1) return interval + " mins ago";
  return "just now";
}

// 📝 Create a post
router.post("/", auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "text required" });
    }

    // get user info
    const user = await User.findById(req.userId).select("name email");
    if (!user) return res.status(401).json({ error: "user not found" });

    const post = await CommunityPost.create({
      userId: req.userId,
      userName: user.name || user.email,   // ✅ store userName
      text,
      reactions: { like: 0, love: 0, support: 0 } // ✅ default reactions
    });

    res.json({
      _id: post._id,
      text: post.text,
      user: { id: user._id, name: user.name || user.email },
      createdAt: post.createdAt,
      timeAgo: timeSince(post.createdAt),
      reactions: post.reactions,
    });
  } catch (err) {
    console.error("Failed to create post:", err);
    res.status(500).json({ error: "failed to create post" });
  }
});

// 📜 Get posts
router.get("/", auth, async (req, res) => {
  try {
    const posts = await CommunityPost.find().sort({ createdAt: -1 }).limit(50);

    const data = posts.map((p) => ({
      _id: p._id,
      text: p.text,
      user: { id: p.userId, name: p.userName || "Anonymous" },
      createdAt: p.createdAt,
      timeAgo: timeSince(p.createdAt),
      reactions: p.reactions || {},
    }));

    res.json(data);
  } catch (err) {
    console.error("Failed to load posts:", err);
    res.status(500).json({ error: "failed to load posts" });
  }
});

// 🔥 React to a post
router.post("/:id/react", auth, async (req, res) => {
  try {
    const { reaction } = req.body; // e.g. "like", "love", "support"
    if (!reaction) return res.status(400).json({ error: "reaction required" });

    const post = await CommunityPost.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "post not found" });

    if (!post.reactions) post.reactions = {};
    post.reactions[reaction] = (post.reactions[reaction] || 0) + 1;
    await post.save();

    res.json({
      _id: post._id,
      text: post.text,
      user: { id: post.userId, name: post.userName },
      createdAt: post.createdAt,
      timeAgo: timeSince(post.createdAt),
      reactions: post.reactions,
    });
  } catch (err) {
    console.error("Failed to react to post:", err);
    res.status(500).json({ error: "failed to react" });
  }
});

module.exports = router;
