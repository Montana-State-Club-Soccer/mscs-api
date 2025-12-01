const express = require('express');
const router = express.Router();
const Game = require('../models/Game');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// GET all games (schedule)
router.get('/', async (req, res) => {
    try {
        const games = await Game.find().sort({ date: 1 });
        res.json(games);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single game
router.get('/:id', async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }
        res.json(game);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new game (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const game = new Game({
        opponent: req.body.opponent,
        date: req.body.date,
        time: req.body.time,
        location: req.body.location,
        homeAway: req.body.homeAway,
        isCompleted: req.body.isCompleted || false
    });

    try {
        const newGame = await game.save();
        res.status(201).json(newGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update game (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        if (req.body.opponent) game.opponent = req.body.opponent;
        if (req.body.date) game.date = req.body.date;
        if (req.body.time) game.time = req.body.time;
        if (req.body.location) game.location = req.body.location;
        if (req.body.homeAway) game.homeAway = req.body.homeAway;
        if (req.body.isCompleted !== undefined) game.isCompleted = req.body.isCompleted;

        const updatedGame = await game.save();
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE game (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const game = await Game.findById(req.params.id);
        if (!game) {
            return res.status(404).json({ message: 'Game not found' });
        }

        await game.deleteOne();
        res.json({ message: 'Game deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
