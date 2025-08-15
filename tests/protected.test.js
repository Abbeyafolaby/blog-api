import request from 'supertest';
import app from '../app.js';
import { generateToken } from './utils.js';

describe('Protected routes', () => {
  it('rejects without token', async () => {
    const res = await request(app).get('/api/protected/me');
    expect(res.status).toBe(401);
  });

  it('returns user with valid token', async () => {
    const token = generateToken();
    const res = await request(app)
      .get('/api/protected/me')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
  });
});


