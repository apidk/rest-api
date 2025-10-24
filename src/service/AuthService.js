const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../db/models');

// Note: this can be extracted to config
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SALT_ROUNDS = 10;

class AuthService {
  async register(username, password) {
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      username,
      password: hashedPassword,
    });

    return {
      id: user.id,
      username: user.username,
      createdAt: user.created_at,
    };
  }

  async login(username, password) {
    const user = await User.findOne({ where: { username } });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    return {
      token,
      id: user.id,
    };
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }
}

module.exports = new AuthService();
