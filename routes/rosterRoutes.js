const express = require('express');
const router = express.Router();
const RosterMember = require('../models/RosterMember');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

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

// basic validation helper
const sanitizeString = (val) => typeof val === 'string' ? val.trim() : val;
const validateRosterPayload = (body, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!body.name || !body.name.trim()) errors.push('name is required');
        if (!body.position || !body.position.trim()) errors.push('position is required');
    }
    if (body.number !== undefined && body.number !== null && isNaN(Number(body.number))) {
        errors.push('number must be numeric');
    }
    return errors;
};

// POST new roster member (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const errors = validateRosterPayload(req.body);
    if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

    const member = new RosterMember({
        name: sanitizeString(req.body.name),
        position: sanitizeString(req.body.position),
        number: req.body.number !== undefined ? Number(req.body.number) : undefined,
        year: sanitizeString(req.body.year),
        imageUrl: sanitizeString(req.body.imageUrl),
        isCoach: !!req.body.isCoach
    });

    try {
        const newMember = await member.save();
        res.status(201).json(newMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// PUT update roster member (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const member = await RosterMember.findById(req.params.id);
        if (!member) return res.status(404).json({ message: 'Member not found' });

        const errors = validateRosterPayload(req.body, true);
        if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

        if (req.body.name !== undefined) member.name = sanitizeString(req.body.name);
        if (req.body.position !== undefined) member.position = sanitizeString(req.body.position);
        if (req.body.number !== undefined) member.number = Number(req.body.number);
        if (req.body.year !== undefined) member.year = sanitizeString(req.body.year);
        if (req.body.imageUrl !== undefined) member.imageUrl = sanitizeString(req.body.imageUrl);
        if (req.body.isCoach !== undefined) member.isCoach = !!req.body.isCoach;

        const updatedMember = await member.save();
        res.json(updatedMember);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE roster member (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
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
