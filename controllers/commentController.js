import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

/**
 * Add a comment to a post
 * @route POST /api/posts/:postId/comments
 * @access Private (authenticated users only)
 */
export const addComment = async (req, res) => {
  try {
    const { content, parentComment } = req.body;
    const { postId } = req.params;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if post is published
    if (!post.published) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Create new comment
    const comment = new Comment({
      content,
      author: req.user.id,
      post: postId,
      parentComment: parentComment || null
    });
    
    await comment.save();
    
    // Populate author information
    await comment.populate('author', 'name email');
    
    res.status(201).json({
      success: true,
      data: comment
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get comments for a specific post
 * @route GET /api/posts/:postId/comments
 * @access Public
 */
export const getComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get comments with pagination
    const comments = await Comment.find({ post: postId })
      .populate('author', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination info
    const total = await Comment.countDocuments({ post: postId });
    
    res.json({
      success: true,
      data: comments,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalComments: total,
        hasNext: skip + comments.length < total,
        hasPrev: parseInt(page) > 1
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete a comment
 * @route DELETE /api/comments/:id
 * @access Private (comment owner or admin only)
 */
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }
    
    // Check if user is comment owner or admin
    if (comment.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this comment'
      });
    }
    
    await Comment.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
