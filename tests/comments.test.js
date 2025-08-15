import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { generateToken } from './utils.js';

describe('Comment routes', () => {
  it('creates and lists comments for a post', async () => {
    const user = await User.create({ name: 'Bob', email: 'bob@example.com', password: 'password123', role: 'reader' });
    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });
    const post = await Post.create({ title: 'Post', content: 'Some sufficient content', author: user._id, published: true });

    const addRes = await request(app)
      .post(`/api/comments/posts/${post._id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ content: 'Nice post!' });
    expect(addRes.status).toBe(201);

    const listRes = await request(app).get(`/api/comments/posts/${post._id}/comments`);
    expect(listRes.status).toBe(200);
    expect(listRes.body.data.length).toBe(1);
  });

  it('prevents non-owner from deleting comment', async () => {
    const owner = await User.create({ name: 'Carol', email: 'carol@example.com', password: 'password123', role: 'reader' });
    const other = await User.create({ name: 'Eve', email: 'eve@example.com', password: 'password123', role: 'reader' });
    const ownerToken = generateToken({ id: owner._id.toString(), email: owner.email, role: owner.role, name: owner.name });
    const otherToken = generateToken({ id: other._id.toString(), email: other.email, role: other.role, name: other.name });

    const post = await Post.create({ title: 'Post2', content: 'Some sufficient content #2', author: owner._id, published: true });
    const comment = await Comment.create({ content: 'Owner comment', author: owner._id, post: post._id });

    const res = await request(app)
      .delete(`/api/comments/${comment._id}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(res.status).toBe(403);
  });
});


