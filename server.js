const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Import routes
const authRouter = require('./routes/authRoutes');
const rosterRouter = require('./routes/rosterRoutes');
const scheduleRouter = require('./routes/scheduleRoutes');
const resultsRouter = require('./routes/resultsRoutes');
const highlightsRouter = require('./routes/highlightsRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

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


app.get('/', (req, res) => {
    res.send('Roster API is running and connected to MongoDB.');
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
