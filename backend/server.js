const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'https://task-manager-rohang-xi.vercel.app'], // Support both loopback addresses
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => { // Request logger
    console.log(`${req.method} ${req.url} `);
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', require('./middleware/authMiddleware').protect, taskRoutes);

app.get('/', (req, res) => {
    res.send('Task Manager API is running');
});

// Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT} `);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });
