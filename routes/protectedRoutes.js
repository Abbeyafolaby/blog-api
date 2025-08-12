const express = require('express');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

router.get('/me', authenticate, (req, res) => {
  return res.json({ message: 'Protected route', user: req.user });
});

module.exports = router;


