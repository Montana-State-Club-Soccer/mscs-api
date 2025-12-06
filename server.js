const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRouter = require('./routes/authRoutes');
const rosterRouter = require('./routes/rosterRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');
const resultsRouter = require('./routes/resultsRoutes');
const highlightsRouter = require('./routes/highlightsRoutes');
const uploadRouter = require('./routes/uploadRoutes');
const eventsRouter = require('./routes/eventsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// CORS configuration - allow requests from UI hosted on Vercel or localhost
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://mscs-ui-hbad.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      // For development, allow all origins
      if (process.env.NODE_ENV === 'development') {
        return callback(null, true);
      }
      return callback(new Error('Not allowed by CORS'));
    }
    return callback(null, true);
  },
  credentials: true,
}));
app.use(express.json());
app.use(helmet({
  // Disable helmet's ETag handling
  crossOriginResourcePolicy: false,
}));

// Disable caching for API responses
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', authLimiter);

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connection successful!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

app.use('/api/auth', authRouter);
app.use('/api/roster', rosterRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/results', resultsRouter);
app.use('/api/highlights', highlightsRouter); 
app.use('/api/uploads', uploadRouter);
app.use('/api/events', eventsRouter);


app.get('/', (req, res) => {
    res.send('Roster API is running and connected to MongoDB.');
});

app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
