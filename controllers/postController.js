import Post from '../models/Post.js';
import User from '../models/User.js';

/**
 * Create a new post
 * @route POST /api/posts
 * @access Private (authenticated users only)
 */
export const createPost = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Create new post
    const post = new Post({
      title,
      content,
      tags: tags || [],
      author: req.user.id
    });

    await post.save();
    
    // Populate author information
    await post.populate('author', 'name email');
    
    res.status(201).json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Get all posts with pagination and filtering
 * @route GET /api/posts
 * @access Public
 */
export const getPosts = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, tags, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    
    // Build query object
    const query = { published: true };
    
    // Filter by author
    if (author) {
      const authorUser = await User.findOne({ name: { $regex: author, $options: 'i' } });
      if (authorUser) {
        query.author = authorUser._id;
      }
    }
    
    // Filter by tags
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim().toLowerCase());
      query.tags = { $in: tagArray };
    }
    
    // Search in title and content
    if (search) {
      query.$text = { $search: search };
    }
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Execute query with pagination
    const posts = await Post.find(query)
      .populate('author', 'name email')
      .populate('commentCount')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination info
    const total = await Post.countDocuments(query);
    
    res.json({
      success: true,
      data: posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalPosts: total,
        hasNext: skip + posts.length < total,
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
 * Get a single post by ID
 * @route GET /api/posts/:id
 * @access Public
 */
export const getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name email')
      .populate('commentCount');
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Update a post
 * @route PUT /api/posts/:id
 * @access Private (post owner or admin only)
 */
export const updatePost = async (req, res) => {
  try {
    const { title, content, tags, published } = req.body;
    
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post'
      });
    }
    
    // Update fields
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;
    if (tags !== undefined) post.tags = tags;
    if (published !== undefined) post.published = published;
    
    await post.save();
    
    // Populate author information
    await post.populate('author', 'name email');
    
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Delete a post
 * @route DELETE /api/posts/:id
 * @access Private (post owner or admin only)
 */
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found'
      });
    }
    
    // Check if user is post owner or admin
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post'
      });
    }
    
    await Post.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Post deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
