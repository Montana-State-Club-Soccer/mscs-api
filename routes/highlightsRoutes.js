const express = require('express');
const router = express.Router();
const Highlight = require('../models/Highlight');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET all highlights
router.get('/', async (req, res) => {
    try {
        const highlights = await Highlight.find()
            .populate('playerId', 'name position number')
            .sort({ timestamp: -1 });
        res.json(highlights);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single highlight
router.get('/:id', async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id)
            .populate('playerId', 'name position number');
        if (!highlight) {
            return res.status(404).json({ message: 'Highlight not found' });
        }
        res.json(highlight);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new highlight (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const highlight = new Highlight({
        playerId: req.body.playerId,
        content: req.body.content,
        mediaUrl: req.body.mediaUrl,
        timestamp: req.body.timestamp || Date.now()
    });

    try {
        const newHighlight = await highlight.save();
        const populatedHighlight = await Highlight.findById(newHighlight._id)
            .populate('playerId', 'name position number');
        res.status(201).json(populatedHighlight);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update highlight (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) {
            return res.status(404).json({ message: 'Highlight not found' });
        }

        if (req.body.playerId) highlight.playerId = req.body.playerId;
        if (req.body.content) highlight.content = req.body.content;
        if (req.body.mediaUrl) highlight.mediaUrl = req.body.mediaUrl;
        if (req.body.timestamp) highlight.timestamp = req.body.timestamp;

        const updatedHighlight = await highlight.save();
        const populatedHighlight = await Highlight.findById(updatedHighlight._id)
            .populate('playerId', 'name position number');
        res.json(populatedHighlight);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE highlight (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const highlight = await Highlight.findById(req.params.id);
        if (!highlight) {
            return res.status(404).json({ message: 'Highlight not found' });
        }

        await highlight.deleteOne();
        res.json({ message: 'Highlight deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
