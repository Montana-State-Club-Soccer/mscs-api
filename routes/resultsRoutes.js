const express = require('express');
const router = express.Router();
const Result = require('../models/Result');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET all results
router.get('/', async (req, res) => {
    try {
        const results = await Result.find().sort({ date: -1 });
        res.json(results);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single result
router.get('/:id', async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new result (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const result = new Result({
        opponent: req.body.opponent,
        score: req.body.score,
        opponentScore: req.body.opponentScore,
        date: req.body.date,
        location: req.body.location,
        gameId: req.body.gameId
    });

    try {
        const newResult = await result.save();
        res.status(201).json(newResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update result (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        if (req.body.opponent) result.opponent = req.body.opponent;
        if (req.body.score !== undefined) result.score = req.body.score;
        if (req.body.opponentScore !== undefined) result.opponentScore = req.body.opponentScore;
        if (req.body.date) result.date = req.body.date;
        if (req.body.location) result.location = req.body.location;
        if (req.body.gameId) result.gameId = req.body.gameId;

        const updatedResult = await result.save();
        res.json(updatedResult);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE result (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const result = await Result.findById(req.params.id);
        if (!result) {
            return res.status(404).json({ message: 'Result not found' });
        }

        await result.deleteOne();
        res.json({ message: 'Result deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
