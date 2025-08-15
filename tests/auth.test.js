import request from 'supertest';
import app from '../app.js';

describe('Auth routes', () => {
  const user = {
    name: 'Test User',
    email: 'user@example.com',
    password: 'password123',
  };

  it('registers a user', async () => {
    const res = await request(app).post('/api/auth/register').send(user);
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ name: user.name, email: user.email.toLowerCase() });
  });

  it('logs in a user', async () => {
    await request(app).post('/api/auth/register').send(user).expect(201);
    const res = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toMatchObject({ email: user.email.toLowerCase() });
  });

  it('rejects invalid login', async () => {
    const res = await request(app).post('/api/auth/login').send({ email: 'bad@example.com', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});


