const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    opponent: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        required: true,
        min: 0
    },
    opponentScore: {
        type: Number,
        required: true,
        min: 0
    },
    date: {
        type: Date,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Result', resultSchema);
