const express = require('express');
const cors = require('cors'); // Must be installed
const helmet = require('helmet');

const app = express();

// --- MIDDLEWARE (ORDER MATTERS!) ---

// 1. CORS: Allow the frontend to talk to us
// We explicitly allow requests from anywhere (*) to fix the blocking
app.use(cors({
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Parse JSON bodies (so we can read req.body)
app.use(express.json());

// 3. Security Headers
app.use(helmet());

// --- ROUTES ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/sweets', require('./routes/sweetRoutes'));

// Test Route
app.get('/', (req, res) => res.send('Backend is working!'));

module.exports = app;