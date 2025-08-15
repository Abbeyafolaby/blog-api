import jwt from 'jsonwebtoken';

export function generateToken(payload = { id: '000000000000000000000001', email: 'user@example.com', role: 'reader', name: 'User' }) {
  const secret = process.env.JWT_SECRET || 'test-secret';
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}


