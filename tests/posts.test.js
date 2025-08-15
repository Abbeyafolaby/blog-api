import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import Post from '../models/Post.js';
import { generateToken } from './utils.js';

describe('Post routes', () => {
  it('lists posts (empty initially)', async () => {
    const res = await request(app).get('/api/posts');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('creates, fetches, updates and deletes a post', async () => {
    const user = await User.create({ name: 'Alice', email: 'alice@example.com', password: 'password123', role: 'author' });
    const token = generateToken({ id: user._id.toString(), email: user.email, role: user.role, name: user.name });

    // create
    const createRes = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Title', content: 'This is the content long enough', tags: ['news'] });
    expect(createRes.status).toBe(201);
    const postId = createRes.body.data._id;

    // get by id
    const getRes = await request(app).get(`/api/posts/${postId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.title).toBe('My Title');

    // update by owner
    const updateRes = await request(app)
      .put(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated', published: true });
    expect(updateRes.status).toBe(200);
    expect(updateRes.body.data.title).toBe('Updated');

    // delete by owner
    const deleteRes = await request(app)
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(deleteRes.status).toBe(200);
    expect(deleteRes.body.success).toBe(true);
  });

  it('prevents non-owner from updating/deleting', async () => {
    const owner = await User.create({ name: 'Owner', email: 'owner@example.com', password: 'password123', role: 'author' });
    const other = await User.create({ name: 'Other', email: 'other@example.com', password: 'password123', role: 'author' });
    const ownerToken = generateToken({ id: owner._id.toString(), email: owner.email, role: owner.role, name: owner.name });
    const otherToken = generateToken({ id: other._id.toString(), email: other.email, role: other.role, name: other.name });

    const post = await Post.create({ title: 'Post Title', content: 'Long enough content', author: owner._id, tags: [], published: true });

    const resUpdate = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hack' });
    expect(resUpdate.status).toBe(403);

    const resDelete = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${otherToken}`);
    expect(resDelete.status).toBe(403);
  });
});


