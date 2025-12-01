const express = require('express');
const router = express.Router();
const RosterMember = require('../models/RosterMember');

// GET all roster members
router.get('/', async (req, res) => {
    try {
        const members = await RosterMember.find();
        res.json(members);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single roster member
router.get('/:id', async (req, res) => {
    try {
        const member = await RosterMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }
        res.json(member);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST new roster member
router.post('/', async (req, res) => {
    const member = new RosterMember({
        name: req.body.name,
        position: req.body.position,
        number: req.body.number,
        year: req.body.year,
        imageUrl: req.body.imageUrl,
        isCoach: req.body.isCoach || false
    });

    try {
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update roster member
router.put('/:id', async (req, res) => {
    try {
        const member = await RosterMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        if (req.body.name) member.name = req.body.name;
        if (req.body.position) member.position = req.body.position;
        if (req.body.number !== undefined) member.number = req.body.number;
        if (req.body.year) member.year = req.body.year;
        if (req.body.imageUrl) member.imageUrl = req.body.imageUrl;
        if (req.body.isCoach !== undefined) member.isCoach = req.body.isCoach;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE roster member
router.delete('/:id', async (req, res) => {
    try {
        const member = await RosterMember.findById(req.params.id);
        if (!member) {
            return res.status(404).json({ message: 'Member not found' });
        }

        await member.deleteOne();
        res.json({ message: 'Member deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
