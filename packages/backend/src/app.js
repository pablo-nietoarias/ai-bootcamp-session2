const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { db } = require('./db/database');
const itemsRouter = require('./routes/items');
const tagsRouter = require('./routes/tags');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Health check endpoint
app.get('/', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend server is running' });
});

// API Routes
app.use('/api/items', itemsRouter);
app.use('/api/tags', tagsRouter);

module.exports = { app, db };