const mongoose = require('mongoose');

const rosterMemberSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    number: {
        type: Number,
        required: false
    },
    year: {
        type: String,
        required: false
    },
    imageUrl: {
        type: String,
        required: false
    },
    isCoach: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('RosterMember', rosterMemberSchema);
