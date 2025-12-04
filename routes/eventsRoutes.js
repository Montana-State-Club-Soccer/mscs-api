const express = require('express');
const router = express.Router();
const Event = require('../models/Event'); 
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const sanitizeString = (val) => typeof val === 'string' ? val.trim() : val;

const validateEventPayload = (body, isUpdate = false) => {
    const errors = [];
    if (!isUpdate) {
        if (!body.title || !body.title.trim()) errors.push('title is required');
        if (!body.imageUrl || !body.imageUrl.trim()) errors.push('imageUrl is required');
    }
    if (isUpdate) {
        if (body.title !== undefined && !body.title.trim()) errors.push('title cannot be empty');
        if (body.imageUrl !== undefined && !body.imageUrl.trim()) errors.push('imageUrl cannot be empty');
    }
    return errors;
};


// GET all events
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ createdAt: -1 }); 
        res.json(events);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET single event
router.get('/:id', async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        res.json(event);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// POST new event (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    const errors = validateEventPayload(req.body);
    if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

    const event = new Event({
        title: sanitizeString(req.body.title),
        description: sanitizeString(req.body.description),
        imageUrl: sanitizeString(req.body.imageUrl),
    });

    try {
        const newEvent = await event.save();
        res.status(201).json(newEvent) // 201 Created
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// PUT update event (admin only)
router.put('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        const errors = validateEventPayload(req.body, true);
        if (errors.length) return res.status(400).json({ message: 'Validation failed', errors });

        if (req.body.title !== undefined) event.title = sanitizeString(req.body.title);
        if (req.body.description !== undefined) event.description = sanitizeString(req.body.description);
        if (req.body.imageUrl !== undefined) event.imageUrl = sanitizeString(req.body.imageUrl);

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});


// DELETE event (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);
        
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.json({ message: 'Event deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;