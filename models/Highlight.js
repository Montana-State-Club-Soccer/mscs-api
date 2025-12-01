const mongoose = require('mongoose');

const highlightSchema = new mongoose.Schema({
    playerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RosterMember',
        required: true
    },
    content: {
        type: String,
        required: true
    },
    mediaUrl: {
        type: String,
        required: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Highlight', highlightSchema);
