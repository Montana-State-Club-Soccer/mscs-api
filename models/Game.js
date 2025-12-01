const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
    opponent: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    homeAway: {
        type: String,
        enum: ['home', 'away'],
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Game', gameSchema);
