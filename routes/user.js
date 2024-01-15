const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

const User = require('../models/user');

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Register a new user.
 *     description: Register a new user with a valid name, email, and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address.
 *               password:
 *                 type: string
 *                 description: User's password (at least 9 characters).
 *     responses:
 *       200:
 *         description: User registered successfully.
 *       400:
 *         description: Bad request. Check the request payload or user already exists.
 *       500:
 *         description: Internal server error.
 */
router.post('/', [
  check('name', 'Please enter your full name').not().isEmpty(),
  check('email', 'Please enter a valid email address').isEmail(),
  check('password', 'Please enter a password with at least 9 characters').isLength({
    min: 9,
  }),
], async (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() });
  }

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWTSECRET, { expiresIn: '1800000' }, (err, token) => {
      if (err) throw err;
      return res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
