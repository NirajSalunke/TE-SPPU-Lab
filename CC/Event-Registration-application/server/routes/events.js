const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const Registration = require('../models/Registration');

// GET /api/events — Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch events', message: err.message });
  }
});

// GET /api/events/:id — Get single event
router.get('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch event', message: err.message });
  }
});

// POST /api/events — Create new event
router.post('/', async (req, res) => {
  try {
    const { name, description, date, location, maxCapacity, imageUrl } = req.body;

    if (!name || !date || !location || !maxCapacity) {
      return res.status(400).json({ error: 'Name, date, location, and maxCapacity are required' });
    }

    const event = new Event({ name, description, date, location, maxCapacity, imageUrl });
    const saved = await event.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create event', message: err.message });
  }
});

// PUT /api/events/:id — Update event
router.put('/:id', async (req, res) => {
  try {
    const { name, description, date, location, maxCapacity, imageUrl } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Ensure capacity isn't reduced below current registrations
    if (maxCapacity !== undefined && maxCapacity < event.registrationCount) {
      return res.status(400).json({
        error: `Cannot reduce capacity below current registrations (${event.registrationCount})`,
      });
    }

    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { name, description, date, location, maxCapacity, imageUrl },
      { new: true, runValidators: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update event', message: err.message });
  }
});

// DELETE /api/events/:id — Delete event and its registrations
router.delete('/:id', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    await Registration.deleteMany({ event: req.params.id });
    await Event.findByIdAndDelete(req.params.id);

    res.json({ message: 'Event and all its registrations deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete event', message: err.message });
  }
});

// GET /api/events/:id/registrations — Get all registrations for an event
router.get('/:id/registrations', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const registrations = await Registration.find({ event: req.params.id }).sort({ createdAt: -1 });
    res.json(registrations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch registrations', message: err.message });
  }
});

// POST /api/events/:id/register — Register for an event
router.post('/:id/register', async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    // Check capacity
    if (event.registrationCount >= event.maxCapacity) {
      return res.status(400).json({ error: 'This event has reached maximum capacity' });
    }

    const { fullName, email, phone } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email are required' });
    }

    // Check for duplicate email
    const existing = await Registration.findOne({ event: req.params.id, email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ error: 'You have already registered for this event with this email address' });
    }

    const registration = new Registration({ event: req.params.id, fullName, email, phone });
    const saved = await registration.save();

    // Increment registration count
    await Event.findByIdAndUpdate(req.params.id, { $inc: { registrationCount: 1 } });

    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ error: 'You have already registered for this event with this email address' });
    }
    res.status(400).json({ error: 'Failed to register', message: err.message });
  }
});

module.exports = router;
