const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRouter = require('./routes/authRoutes');
const rosterRouter = require('./routes/rosterRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');
const resultsRouter = require('./routes/resultsRoutes');
const highlightsRouter = require('./routes/highlightsRoutes');
const uploadRouter = require('./routes/uploadRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(helmet());

// rate limit login endpoint to mitigate brute force
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20 });
app.use('/api/auth/login', authLimiter);

// Legacy local uploads (now using Cloudinary). Keep static route if existing files present.
// Remove this block once migrated and old files no longer needed.
// const path = require('path');
// const fs = require('fs');
// const uploadsDir = path.join(__dirname, 'uploads');
// if (!fs.existsSync(uploadsDir)) {
//     fs.mkdirSync(uploadsDir);
// }
// app.use('/uploads', express.static(uploadsDir));

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connection successful!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// Register routes
app.use('/api/auth', authRouter);
app.use('/api/roster', rosterRouter);
app.use('/api/schedule', scheduleRouter);
app.use('/api/results', resultsRouter);
app.use('/api/highlights', highlightsRouter); 
app.use('/api/uploads', uploadRouter);


app.get('/', (req, res) => {
    res.send('Roster API is running and connected to MongoDB.');
});

// centralized error handler (minimal)
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (res.headersSent) return next(err);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
