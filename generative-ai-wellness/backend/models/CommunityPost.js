const mongoose = require('mongoose');

const ReactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: { type: String, enum: ["like", "love", "support", "insightful"], required: true }
}, { timestamps: true });

const CommentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  userName: { type: String, required: true },
  text: { type: String, required: true },
  replies: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
  }],
  createdAt: { type: Date, default: Date.now }
});



const CommunityPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  userName: { type: String, required: true }, // ✅ ensure we always store userName
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  reactions: {
    likes: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
  }
});

module.exports = mongoose.model("CommunityPost", CommunityPostSchema);

