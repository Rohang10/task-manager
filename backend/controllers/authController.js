const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Generate Access Token (Short lived)
const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
};

// Generate Refresh Token (Long lived)
const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
};

// Helper to set cookie
const setRefreshTokenCookie = (res, token) => {
    res.cookie('refreshToken', token, {
        httpOnly: true,
        secure: false, // Set to false for localhost/http development
        sameSite: 'lax', // Relax strictness for development to avoid issues with redirects
    });
};

// POST /api/auth/signup
exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please add all fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            passwordHash: hashedPassword,
        });

        if (user) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            setRefreshTokenCookie(res, refreshToken);

            res.status(201).json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: accessToken,
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.passwordHash))) {
            const accessToken = generateAccessToken(user.id);
            const refreshToken = generateRefreshToken(user.id);
            setRefreshTokenCookie(res, refreshToken);

            res.json({
                _id: user.id,
                name: user.name,
                email: user.email,
                token: accessToken,
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/auth/logout
exports.logout = (req, res) => {
    res.cookie('refreshToken', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.json({ message: 'Logged out successfully' });
};

// POST /api/auth/refresh
exports.refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        console.log('Refresh request received. Cookie present:', !!refreshToken);
        if (!refreshToken) {
            return res.status(401).json({ message: 'Not authorized, no refresh token' });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        const accessToken = generateAccessToken(user.id);
        // Rotating refresh tokens? For simplicity, we keep the same one until it expires, 
        // or issue a new one to extend session. Let's just return new AT.

        res.json({ token: accessToken });
    } catch (error) {
        console.error('Refresh Token Error:', error.message);
        res.status(401).json({ message: 'Not authorized, invalid refresh token' });
    }
};
