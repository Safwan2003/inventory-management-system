const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Get the currently logged-in user.
 *     description: Retrieve the user details for the currently authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully.
 *       500:
 *         description: Internal server error.
 */

router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    return res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error!' });
  }
});

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate user and get token.
 *     description: Authenticate a user with a valid email and password, and obtain an authentication token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password.
 *     responses:
 *       200:
 *         description: Authentication successful. Returns an authentication token.
 *       400:
 *         description: Bad request. Invalid email, password, or user does not exist.
 *       500:
 *         description: Internal server error.
 */

router.post('/', [
  check('email', 'Please enter a valid email').isEmail(),
  check('password', 'Please enter a valid password').exists(),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User does not exist!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid password' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '30m' }, (err, token) => {
      if (err) throw err;
      return res.json({
        token,
      });
    });
  } catch (err) {
    console.error(err.message);
    return res.status(500).json({ msg: 'Server error!' });
  }
});

module.exports = router;
