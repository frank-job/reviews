require('dotenv').config();
const express = require('express');
const app = express();
const mongodb = require('./data/database');
const routes = require('./routes/index');
const cors = require('cors');

const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Custom JSON parser that catches errors and returns JSON instead of HTML
app.use((req, res, next) => {
  express.json()(req, res, (err) => {
    if (err) {
      return res.status(400).json({
        error: 'Invalid JSON in request body',
        details: err.message
      });
    }
    next();
  });
});

// Initialize database first, then start the server
mongodb.initDb((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
    process.exit(1);
  } else {
    app.use('/', routes);

    app.get("/", (req, res) => {
      res.send("Hello from Express!");
    });

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  }
});