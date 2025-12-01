const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const rosterRouter = require('./routes/rosterRoutes'); 

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); 
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

mongoose.connect(mongoUri)
    .then(() => console.log('✅ MongoDB connection successful!'))
    .catch(err => console.error('❌ MongoDB connection error:', err));


app.use('/api/roster', rosterRouter); 


app.get('/', (req, res) => {
    res.send('Roster API is running and connected to MongoDB.');
});


app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
