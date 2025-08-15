import request from 'supertest';
import app from '../app.js';

describe('Health endpoint', () => {
  it('GET / should return ok', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ status: 'ok', message: 'Blog API' });
  });
});


